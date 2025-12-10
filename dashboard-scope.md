# Dashboard Feature - Scope Document

## Overview
A personalized information hub that displays interesting real-time data from around the internet, customized based on the visitor's location (via IP address). Think of it as a "daily briefing" widget collection.

---

## Core Concept
When a visitor clicks "Dashboard," they see a grid of cards showing live, location-aware information:
- Local weather
- Recent earthquakes nearby (or globally)
- Other fun/interesting data pulled from public APIs

---

## Location Detection
- Use visitor's IP address to determine approximate location
- Free IP geolocation API (e.g., ip-api.com, ipinfo.io)
- Fallback to global/default data if location unavailable
- No login required - works automatically

---

## Dashboard Widgets

### 🌤️ Weather Widget
- Current temperature & conditions
- Today's high/low
- Icon for weather type (sunny, cloudy, rain, etc.)
- Location name displayed
- **API:** OpenWeatherMap (free tier) or WeatherAPI

### 🌍 Earthquake Widget
- Recent earthquakes (last 24-48 hours)
- Show magnitude, location, time
- Option: Nearby earthquakes OR significant global quakes
- **API:** USGS Earthquake API (free, no key needed)

### 📰 News Headlines Widget (Optional)
- Top headlines from user's country
- Or tech/science news
- **API:** NewsAPI or GNews

### 🌅 Sun & Moon Widget
- Sunrise/sunset times for location
- Moon phase
- Day length
- **API:** Sunrise-Sunset API (free)

### 📊 Random Facts Widget
- Daily random fact or trivia
- "On this day in history"
- **API:** Various trivia APIs

### 🌐 IP Info Widget
- Show visitor their own IP
- City, region, country detected
- ISP info (fun to see)
- **API:** Same as geolocation

### 💨 Air Quality Widget
- Current AQI (Air Quality Index) for location
- Pollution level (Good, Moderate, Unhealthy, etc.)
- Main pollutants (PM2.5, PM10, O3, NO2)
- Health recommendations
- Color-coded indicator (green/yellow/orange/red)
- **API:** OpenWeatherMap Air Pollution API (free) or AQICN

### 🚗 Traffic Widget
- General congestion level for the area
- Traffic status (Light, Moderate, Heavy)
- Peak hours info
- Commute estimate indicator
- **API:** TomTom Traffic API (free tier) or HERE Traffic
- *Note: Limited free options - may show general city-level data*

### 🎵 Now Playing Widget (Optional)
- Top trending song in their country
- Or random music recommendation
- **API:** Spotify/LastFM

### 🚀 Space Widget (matches your theme!)
- ISS current location
- Next visible pass over user's location
- Astronauts currently in space
- **API:** Open Notify API (free)

---

## Wireframe (MVP - 6 Widgets)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ◆ ANDREAS       About    Projects    Contact    [Dashboard]                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                        ─── Your Daily Briefing ───                           │
│                    📍 San Francisco, CA, United States                       │
│                                                                              │
│   ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ │
│   │ 🌤️ WEATHER          │  │ 🌍 EARTHQUAKES       │  │ 🚀 SPACE            │ │
│   │                     │  │                     │  │                     │ │
│   │      ☀️ 72°F        │  │ Recent (24h):       │  │ ISS Location:       │
│   │   Partly Cloudy     │  │                     │  │ Over Pacific Ocean  │
│   │                     │  │ • M4.2 - Chile      │  │                     │ │
│   │ H: 78° L: 61°       │  │ • M3.8 - Japan      │  │ 🧑‍🚀 7 astronauts    │
│   │ Humidity: 65%       │  │ • M5.1 - Indonesia  │  │ in space right now  │
│   │                     │  │                     │  │                     │ │
│   └─────────────────────┘  └─────────────────────┘  └─────────────────────┘ │
│                                                                              │
│   ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ │
│   │ 💨 AIR QUALITY      │  │ 🚗 TRAFFIC           │  │ 🌐 YOUR LOCATION    │ │
│   │                     │  │                     │  │                     │ │
│   │     AQI: 42         │  │ Current Conditions: │  │ IP: 73.xxx.xxx.xx   │ │
│   │   ● GOOD            │  │                     │  │                     │ │
│   │   ███████░░░        │  │ 🟡 MODERATE         │  │ City: San Francisco │ │
│   │                     │  │   Some congestion   │  │ Region: California  │ │
│   │ PM2.5: 12 µg/m³     │  │   on main routes    │  │ Country: USA        │ │
│   │ "Great for outdoor  │  │                     │  │ ISP: Comcast        │ │
│   │  activities"        │  │ Peak: 5-7 PM        │  │                     │ │
│   │                     │  │                     │  │                     │ │
│   └─────────────────────┘  └─────────────────────┘  └─────────────────────┘ │
│                                                                              │
│                         Last updated: 2 minutes ago                          │
│                            [↻ Refresh Data]                                  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Stacked)
```
┌────────────────────────────┐
│  ◆ ANDREAS           ☰    │
└────────────────────────────┘
┌────────────────────────────┐
│   Your Daily Briefing      │
│   📍 San Francisco, CA     │
├────────────────────────────┤
│ 🌤️ Weather    │ 🌍 Quakes  │
│    72°F       │  M4.2 Chile│
├────────────────────────────┤
│ 🚀 Space      │ 💨 Air     │
│  ISS: Pacific │  AQI: 42   │
├────────────────────────────┤
│ 🚗 Traffic    │ 🌐 Location│
│  Moderate     │  SF, CA    │
└────────────────────────────┘
```

---

## Technical Implementation

### APIs to Use (All Free Tiers)

| Widget | API | Key Required? | Limits |
|--------|-----|---------------|--------|
| IP/Location | ip-api.com | No | 45 req/min |
| Weather | OpenWeatherMap | Yes (free) | 1000 calls/day |
| Earthquakes | USGS Earthquake API | No | Unlimited |
| Space/ISS | open-notify.org | No | Unlimited |
| Air Quality | OpenWeatherMap Air Pollution | Yes (same key) | Included with weather |
| Traffic | TomTom Traffic Flow | Yes (free) | 2,500 calls/day |

### Architecture
```
User visits Dashboard
        ↓
Fetch IP location (ip-api.com)
        ↓
Get lat/long coordinates
        ↓
Parallel API calls:
├── Weather API (with lat/long)
├── Earthquake API (global or nearby)
├── Sunrise/Sunset API (with lat/long)
├── ISS API (current position)
└── News API (with country code)
        ↓
Display all widgets
```

### Page Structure
- **Option 1:** New section on same page (`#dashboard`)
- **Option 2:** Separate page (`dashboard.html`) ← Recommended for complexity

---

## MVP Widgets (Confirmed)

Build these 6 widgets for MVP:

1. ✅ **IP/Location** - Show detected city, country, IP
2. ✅ **Weather** - Current conditions, temp, humidity
3. ✅ **Earthquakes** - Recent global quakes (USGS)
4. ✅ **Space/ISS** - ISS location & astronaut count
5. ✅ **Air Quality** - AQI index, pollution levels, health recommendations
6. ✅ **Traffic** - Local traffic conditions/congestion level

### Phase 2 Additions (Later)
- Sun/Moon times
- News headlines
- Random facts

---

## Design Notes

- Match existing dark theme (#0a0a0f background)
- Cards with subtle borders and glow effects
- Loading skeletons while fetching data
- Error states if API fails
- Mobile responsive (cards stack vertically)
- Auto-refresh every 5-10 minutes (optional)

---

## Confirmed Decisions

1. ✅ **Separate page:** `dashboard.html`

2. ✅ **MVP Widgets (6 total):**
   - Weather
   - Earthquakes  
   - Space/ISS
   - Air Quality
   - Traffic
   - IP/Location Info

3. ✅ **Units:** Show both Fahrenheit AND Celsius (72°F / 22°C)

4. ✅ **Refresh:** Auto-refresh every 10 minutes + manual refresh button

5. ✅ **Traffic:** Detailed stats (congestion %, specific routes, travel times)

6. ✅ **Earthquakes:** Significant only (magnitude 4.0+)

7. ✅ **Nav Style:** Dashboard link matches existing nav links

8. **API Keys Needed:**
   - OpenWeatherMap (free) - for weather + air quality
   - TomTom (free) - for traffic data

---

## Next Steps

1. Confirm widget selection
2. Sign up for free API keys (OpenWeatherMap, NewsAPI if needed)
3. Build HTML structure
4. Style dashboard cards
5. Implement JavaScript API fetching
6. Test with different locations
7. Deploy

---

**Let me know which widgets you want and I'll start building!**
