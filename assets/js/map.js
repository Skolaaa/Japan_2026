// Japan Travel Map - Main Application
// Optimized for GitHub Pages deployment

class JapanTravelMap {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.routes = [];
        this.isInitialized = false;
    }

    // Initialize the map when DOM is ready
    init() {
        if (this.isInitialized) return;
        
        try {
            this.createMap();
            this.addTileLayer();
            this.addControls();
            this.createRoutes();
            this.addMarkers();
            this.setupEventListeners();
            this.fitBounds();
            this.isInitialized = true;
            console.log('🗾 Japan Travel Map initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize map:', error);
            this.showError('Failed to load map. Please refresh the page.');
        }
    }

    // Create the main map instance
    createMap() {
        this.map = L.map('map', {
            center: MAP_CONFIG.center,
            zoom: MAP_CONFIG.zoom,
            minZoom: MAP_CONFIG.minZoom,
            maxZoom: MAP_CONFIG.maxZoom,
            zoomControl: MAP_CONFIG.zoomControl,
            preferCanvas: true // Better performance
        });
    }

    // Add OpenStreetMap tile layer
    addTileLayer() {
        L.tileLayer(TILE_CONFIG.url, {
            attribution: TILE_CONFIG.attribution,
            maxZoom: TILE_CONFIG.maxZoom
        }).addTo(this.map);
    }

    // Add map controls
    addControls() {
        // Custom zoom control position
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);

        // Scale control
        L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: false
        }).addTo(this.map);
    }

    // Create route lines between destinations
    createRoutes() {
        // Week 1: Tokyo base with day trips (star pattern)
        const tokyoBase = TRAVEL_DATA.week1[0].coords;
        TRAVEL_DATA.week1.slice(1).forEach(destination => {
            const route = L.polyline(
                [tokyoBase, destination.coords, tokyoBase], 
                ROUTE_CONFIG.week1
            ).addTo(this.map);
            this.routes.push(route);
        });

        // Week 2: Main route through Japanese Alps
        const week2Coords = TRAVEL_DATA.week2.map(d => d.coords);
        const week2Route = L.polyline(week2Coords, ROUTE_CONFIG.week2).addTo(this.map);
        this.routes.push(week2Route);

        // Week 3: Kansai circuit
        const week3Coords = TRAVEL_DATA.week3.map(d => d.coords);
        const week3Route = L.polyline(week3Coords, ROUTE_CONFIG.week3).addTo(this.map);
        this.routes.push(week3Route);
    }

    // Add markers for all destinations
    addMarkers() {
        const allDestinations = [
            ...TRAVEL_DATA.week1,
            ...TRAVEL_DATA.week2,
            ...TRAVEL_DATA.week3
        ];

        allDestinations.forEach(destination => {
            this.createMarker(destination);
        });
    }

    // Create individual marker with popup
    createMarker(destination) {
        const radius = MARKER_CONFIG[destination.type] || MARKER_CONFIG.main;
        
        const marker = L.circleMarker(destination.coords, {
            radius: radius,
            fillColor: destination.color,
            color: MARKER_CONFIG.strokeColor,
            weight: MARKER_CONFIG.strokeWeight,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(this.map);

        // Create popup content
        const popupContent = this.createPopupContent(destination);
        marker.bindPopup(popupContent, {
            maxWidth: 280,
            closeButton: true,
            className: 'custom-popup'
        });

        // Add hover effects
        marker.on('mouseover', () => {
            marker.setStyle({
                radius: radius + MARKER_CONFIG.hoverIncrease,
                weight: MARKER_CONFIG.strokeWeight + 1
            });
        });

        marker.on('mouseout', () => {
            marker.setStyle({
                radius: radius,
                weight: MARKER_CONFIG.strokeWeight
            });
        });

        // Store marker reference
        this.markers.set(destination.name, marker);
    }

    // Create popup content HTML
    createPopupContent(destination) {
        return `
            <div class="popup-title">${destination.name}</div>
            <div class="popup-week">${destination.days}</div>
            <div class="popup-details">${destination.details}</div>
            ${destination.highlights ? `
                <div style="margin-top: 10px;">
                    <strong>Highlights:</strong>
                    <ul style="margin: 5px 0 0 20px; padding: 0;">
                        ${destination.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    }

    // Setup event listeners
    setupEventListeners() {
        // Handle map load errors
        this.map.on('tileerror', (e) => {
            console.warn('Tile loading error:', e);
        });

        // Handle popup events
        this.map.on('popupopen', (e) => {
            // Ensure popup is visible on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    this.map.panTo(e.popup.getLatLng());
                }, 100);
            }
        });
    }

    // Fit map bounds to show all destinations
    fitBounds() {
        const allCoords = [
            ...TRAVEL_DATA.week1.map(d => d.coords),
            ...TRAVEL_DATA.week2.map(d => d.coords),
            ...TRAVEL_DATA.week3.map(d => d.coords)
        ];

        if (allCoords.length > 0) {
            const group = L.featureGroup(this.routes);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    // Focus on specific location (called by destination buttons)
    focusLocation(lat, lng, name) {
        this.map.setView([lat, lng], 10);
        
        // Find and open popup for this location
        const marker = this.markers.get(name);
        if (marker) {
            marker.openPopup();
        }
    }

    // Show error message
    showError(message) {
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; background: #f8f9fa;">
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #dc3545; margin-bottom: 10px;">⚠️ Map Loading Error</h3>
                    <p style="color: #666;">${message}</p>
                    <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            </div>
        `;
    }
}

// Global function for destination button clicks
function focusLocation(lat, lng, name) {
    if (window.travelMap && window.travelMap.isInitialized) {
        window.travelMap.focusLocation(lat, lng, name);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if required dependencies are loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet not loaded');
        return;
    }

    if (typeof TRAVEL_DATA === 'undefined') {
        console.error('Travel data not loaded');
        return;
    }

    // Create and initialize the map
    window.travelMap = new JapanTravelMap();
    window.travelMap.init();

    // Add some helpful console messages
    console.log('💡 Click destination cards below the map to focus on locations');
    console.log('🆓 This map is completely free - no API keys needed!');
    console.log('📱 Map is optimized for mobile devices');
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    if (window.travelMap && window.travelMap.map) {
        setTimeout(() => {
            window.travelMap.map.invalidateSize();
        }, 100);
    }
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}