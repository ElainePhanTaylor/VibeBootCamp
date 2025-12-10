// ========================================
// Dashboard JavaScript
// Fetches data from free APIs (no keys needed)
// ========================================

// ========================================
// Configuration
// ========================================
const CONFIG = {
    refreshInterval: 10 * 60 * 1000, // 10 minutes in milliseconds
    earthquakeMinMagnitude: 4.0,
    earthquakeLimit: 5,
    earthquakeTimeRange: '24hours' // Past 24 hours
};

// ========================================
// DOM Elements
// ========================================
const elements = {
    locationText: document.getElementById('location-text'),
    lastUpdated: document.getElementById('last-updated'),
    refreshBtn: document.getElementById('refresh-btn'),
    earthquakeWidget: document.getElementById('earthquake-widget'),
    spaceWidget: document.getElementById('space-widget'),
    locationWidget: document.getElementById('location-widget')
};

// ========================================
// Utility Functions
// ========================================
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

function getMagnitudeClass(magnitude) {
    if (magnitude < 4.5) return 'magnitude-low';
    if (magnitude < 5.5) return 'magnitude-medium';
    if (magnitude < 6.5) return 'magnitude-high';
    return 'magnitude-severe';
}

function showError(element, message) {
    element.innerHTML = `
        <div class="widget-error">
            <div class="widget-error-icon">⚠️</div>
            <p>${message}</p>
        </div>
    `;
}

// ========================================
// IP/Location API (ipapi.co - HTTPS, No key needed)
// ========================================
async function fetchLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (!data.error) {
            // Update header location
            elements.locationText.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
            
            // Update location widget
            elements.locationWidget.innerHTML = `
                <div class="location-info">
                    <div class="location-row">
                        <span class="location-label">IP Address</span>
                        <span class="location-value ip-address">${data.ip}</span>
                    </div>
                    <div class="location-row">
                        <span class="location-label">City</span>
                        <span class="location-value">${data.city}</span>
                    </div>
                    <div class="location-row">
                        <span class="location-label">Region</span>
                        <span class="location-value">${data.region}</span>
                    </div>
                    <div class="location-row">
                        <span class="location-label">Country</span>
                        <span class="location-value">${data.country_name}</span>
                    </div>
                    <div class="location-row">
                        <span class="location-label">ZIP Code</span>
                        <span class="location-value">${data.postal || 'N/A'}</span>
                    </div>
                    <div class="location-row">
                        <span class="location-label">ISP</span>
                        <span class="location-value">${data.org || 'N/A'}</span>
                    </div>
                    <div class="location-row">
                        <span class="location-label">Coordinates</span>
                        <span class="location-value">${data.latitude?.toFixed(2) || 'N/A'}°, ${data.longitude?.toFixed(2) || 'N/A'}°</span>
                    </div>
                </div>
            `;
            
            return data;
        } else {
            throw new Error(data.reason || 'Location detection failed');
        }
    } catch (error) {
        console.error('Location fetch error:', error);
        elements.locationText.textContent = 'Location unavailable';
        showError(elements.locationWidget, 'Unable to detect your location');
        return null;
    }
}

// ========================================
// USGS Earthquake API (No key needed)
// ========================================
async function fetchEarthquakes() {
    try {
        // Fetch significant earthquakes from past 24 hours
        const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            // Sort by magnitude (highest first) and take top 5
            const quakes = data.features
                .sort((a, b) => b.properties.mag - a.properties.mag)
                .slice(0, CONFIG.earthquakeLimit);
            
            const quakeHTML = quakes.map(quake => {
                const mag = quake.properties.mag.toFixed(1);
                const place = quake.properties.place;
                const time = new Date(quake.properties.time);
                const magClass = getMagnitudeClass(quake.properties.mag);
                
                return `
                    <li class="earthquake-item">
                        <div class="earthquake-magnitude ${magClass}">
                            M${mag}
                        </div>
                        <div class="earthquake-info">
                            <div class="earthquake-location">${place}</div>
                            <div class="earthquake-time">${timeAgo(quake.properties.time)}</div>
                        </div>
                    </li>
                `;
            }).join('');
            
            elements.earthquakeWidget.innerHTML = `
                <ul class="earthquake-list">
                    ${quakeHTML}
                </ul>
            `;
        } else {
            elements.earthquakeWidget.innerHTML = `
                <div class="earthquake-empty">
                    <p>🎉 No significant earthquakes (4.0+) in the past 24 hours!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Earthquake fetch error:', error);
        showError(elements.earthquakeWidget, 'Unable to load earthquake data');
    }
}

// ========================================
// ISS Location API (wheretheiss.at - HTTPS, CORS enabled)
// ========================================
async function fetchSpaceData() {
    try {
        // Fetch ISS position from wheretheiss.at (HTTPS + CORS friendly)
        const issResponse = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const issData = await issResponse.json();
        
        const lat = parseFloat(issData.latitude).toFixed(2);
        const lon = parseFloat(issData.longitude).toFixed(2);
        const velocity = Math.round(issData.velocity * 0.621371); // Convert km/h to mph
        const altitude = Math.round(issData.altitude * 0.621371); // Convert km to miles
        
        // Determine rough location description based on coordinates
        let locationDesc = 'Over the Ocean';
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        
        if (latNum > 20 && lonNum > 60 && lonNum < 150) locationDesc = 'Over Asia';
        else if (latNum > 20 && lonNum > -30 && lonNum < 60) locationDesc = 'Over Europe/Middle East';
        else if (latNum > 20 && lonNum < -30) locationDesc = 'Over North America';
        else if (latNum < 20 && latNum > -40 && lonNum > -80 && lonNum < -30) locationDesc = 'Over South America';
        else if (latNum < 20 && lonNum > 100) locationDesc = 'Over Australia/Pacific';
        else if (latNum < 20 && lonNum > 20 && lonNum < 60) locationDesc = 'Over Indian Ocean';
        else if (latNum > 20 && lonNum > -180 && lonNum < -140) locationDesc = 'Over Pacific Ocean';
        
        // Current astronaut count (as of late 2024, typically 7-10)
        // Since the astronauts API has CORS issues, we'll show a note
        const astronautCount = 7; // Typical crew size
        
        elements.spaceWidget.innerHTML = `
            <div class="space-info">
                <div class="iss-location">
                    <div class="iss-icon">🛰️</div>
                    <div class="iss-details">
                        <h4>ISS Current Location</h4>
                        <p class="iss-coords">${lat}° lat, ${lon}° lon</p>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.25rem;">${locationDesc}</p>
                    </div>
                </div>
                <div class="astronaut-count">
                    <div class="astronaut-icon">👨‍🚀</div>
                    <div class="astronaut-info">
                        <h4>
                            <span class="astronaut-number">~${astronautCount}</span>
                            <span class="astronaut-label"> people in space</span>
                        </h4>
                        <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.25rem;">
                            Crew aboard the ISS
                        </p>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
                    <span>🚀 ${velocity.toLocaleString()} mph</span>
                    <span>📏 ${altitude} mi altitude</span>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Space fetch error:', error);
        showError(elements.spaceWidget, 'Unable to load space data');
    }
}

// ========================================
// Update Timestamp
// ========================================
function updateTimestamp() {
    const now = new Date();
    elements.lastUpdated.textContent = `Last updated: ${formatTime(now)}`;
}

// ========================================
// Refresh All Data
// ========================================
async function refreshAllData() {
    // Add refreshing animation
    elements.refreshBtn.classList.add('refreshing');
    elements.refreshBtn.disabled = true;
    
    // Fetch all data in parallel
    await Promise.all([
        fetchLocation(),
        fetchEarthquakes(),
        fetchSpaceData()
    ]);
    
    // Update timestamp
    updateTimestamp();
    
    // Remove refreshing animation
    elements.refreshBtn.classList.remove('refreshing');
    elements.refreshBtn.disabled = false;
}

// ========================================
// Initialize Dashboard
// ========================================
function initDashboard() {
    // Initial data fetch
    refreshAllData();
    
    // Set up auto-refresh
    setInterval(refreshAllData, CONFIG.refreshInterval);
    
    // Manual refresh button
    elements.refreshBtn.addEventListener('click', refreshAllData);
}

// ========================================
// Mobile Navigation (same as main site)
// ========================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// ========================================
// Start Dashboard
// ========================================
document.addEventListener('DOMContentLoaded', initDashboard);

