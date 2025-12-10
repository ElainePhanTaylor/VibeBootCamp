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
    lastUpdated: document.getElementById('last-updated'),
    refreshBtn: document.getElementById('refresh-btn'),
    earthquakeWidget: document.getElementById('earthquake-widget')
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
    
    // Fetch earthquake data
    await fetchEarthquakes();
    
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
