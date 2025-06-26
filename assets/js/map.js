// Enhanced Japan Travel Map - Main Application
// Integrates timeline controls, animations, and responsive design
// Optimized for GitHub Pages deployment with performance monitoring

class EnhancedJapanTravelMap {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.timelineController = null;
        this.animationManager = null;
        this.isInitialized = false;
        this.isMobile = window.innerWidth <= 768;
        
        // Performance monitoring
        this.performanceMetrics = {
            initStart: performance.now(),
            mapLoadTime: null,
            firstInteraction: null
        };
        
        // Error tracking
        this.errors = [];
        
        // State management
        this.currentLocation = null;
        this.visibleMarkers = new Set();
        
        // Bind methods to preserve context
        this.handleResize = this.handleResize.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    // Initialize the complete application
    async init() {
        if (this.isInitialized) {
            console.warn('Map already initialized');
            return;
        }
        
        try {
            console.log('🗾 Initializing Enhanced Japan Travel Map...');
            
            // Check for required dependencies
            await this.checkDependencies();
            
            // Initialize map components in order
            await this.createMap();
            this.addTileLayer();
            this.addControls();
            await this.addMarkers();
            this.setupEventListeners();
            
            // Initialize advanced features
            await this.initializeAdvancedFeatures();
            
            // Set initial view
            this.setInitialView();
            
            // Mark as initialized
            this.isInitialized = true;
            this.performanceMetrics.mapLoadTime = performance.now() - this.performanceMetrics.initStart;
            
            // Dispatch ready event
            document.dispatchEvent(new CustomEvent('mapReady', {
                detail: { loadTime: this.performanceMetrics.mapLoadTime }
            }));
            
            console.log(`🚀 Map initialized successfully in ${Math.round(this.performanceMetrics.mapLoadTime)}ms`);
            
        } catch (error) {
            console.error('Failed to initialize map:', error);
            this.logError('Initialization failed', error);
            this.showError('Failed to load interactive map. Please refresh the page.');
        }
    }

    // Check for required dependencies
    async checkDependencies() {
        const required = [
            { name: 'Leaflet', check: () => typeof L !== 'undefined' },
            { name: 'Travel Data', check: () => typeof TRAVEL_DATA !== 'undefined' },
            { name: 'Timeline Controller', check: () => typeof TimelineController !== 'undefined' },
            { name: 'Animation Manager', check: () => typeof AnimationManager !== 'undefined' }
        ];
        
        const missing = required.filter(dep => !dep.check());
        
        if (missing.length > 0) {
            throw new Error(`Missing dependencies: ${missing.map(d => d.name).join(', ')}`);
        }
        
        // Check for optional plugins
        this.checkOptionalPlugins();
    }

    checkOptionalPlugins() {
        const optional = [
            { name: 'Snake Animation', check: () => L.Polyline.prototype.snakeIn },
            { name: 'Polyline Decorator', check: () => typeof L.polylineDecorator === 'function' },
            { name: 'Timeline Plugin', check: () => typeof L.Timeline === 'function' }
        ];
        
        optional.forEach(plugin => {
            if (plugin.check()) {
                console.log(`✅ ${plugin.name} plugin available`);
            } else {
                console.warn(`⚠️ ${plugin.name} plugin not available - some animations may be disabled`);
            }
        });
    }

    // Create the main map instance with enhanced configuration
    async createMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            throw new Error('Map container element not found');
        }
        
        // Enhanced map options
        const mapOptions = {
            center: MAP_CONFIG.center,
            zoom: MAP_CONFIG.zoom,
            minZoom: MAP_CONFIG.minZoom,
            maxZoom: MAP_CONFIG.maxZoom,
            zoomControl: false,
            attributionControl: true,
            preferCanvas: true, // Better performance for many markers
            zoomSnap: 0.5, // Smoother zooming
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 100, // Smoother wheel zoom
            maxBoundsViscosity: 0.3, // Gentle bounds resistance
            // Mobile-specific optimizations
            tap: true,
            tapTolerance: 15,
            touchZoom: true,
            bounceAtZoomLimits: false
        };
        
        // Add Japan-specific bounds to prevent excessive panning
        const japanBounds = L.latLngBounds(
            [24.0, 123.0], // Southwest
            [46.0, 148.0]  // Northeast
        );
        mapOptions.maxBounds = japanBounds;
        
        this.map = L.map('map', mapOptions);
        
        // Store map reference globally for debugging
        window.japanMap = this.map;
    }

    // Add optimized tile layer with error handling
    addTileLayer() {
        const tileLayer = L.tileLayer(TILE_CONFIG.url, {
            attribution: TILE_CONFIG.attribution,
            maxZoom: TILE_CONFIG.maxZoom,
            tileSize: 256,
            zoomOffset: 0,
            // Performance optimizations
            updateWhenIdle: true,
            updateWhenZooming: false,
            keepBuffer: 2,
            // Error handling
            errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZjNzU3ZCI+VGlsZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+'
        });
        
        // Add error handling for tile loading
        tileLayer.on('tileerror', (e) => {
            console.warn('Tile loading error:', e);
        });
        
        tileLayer.on('tileloadstart', () => {
            this.showLoadingIndicator();
        });
        
        tileLayer.on('tileload', () => {
            this.hideLoadingIndicator();
        });
        
        tileLayer.addTo(this.map);
    }

    // Add enhanced map controls
    addControls() {
        // Custom zoom control with better positioning
        L.control.zoom({
            position: 'bottomright',
            zoomInTitle: 'Zoom in to see more detail',
            zoomOutTitle: 'Zoom out to see more area'
        }).addTo(this.map);

        // Scale control (metric only for Japan)
        L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: false,
            maxWidth: 150
        }).addTo(this.map);

        // Custom attribution with project info
        this.map.attributionControl.setPrefix(
            '<a href="https://leafletjs.com" title="Leaflet mapping library">Leaflet</a> | ' +
            '<a href="https://github.com/Skolaaa/Japan_2026" title="View source code">Open Source</a>'
        );

        // Add fullscreen control for desktop
        if (!this.isMobile) {
            this.addFullscreenControl();
        }
    }

    addFullscreenControl() {
        const fullscreenControl = L.control({ position: 'topright' });
        
        fullscreenControl.onAdd = (map) => {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            const button = L.DomUtil.create('a', 'fullscreen-control', container);
            
            button.href = '#';
            button.title = 'Toggle fullscreen';
            button.innerHTML = '⛶';
            button.style.fontSize = '18px';
            button.style.textAlign = 'center';
            button.style.lineHeight = '26px';
            button.style.textDecoration = 'none';
            button.style.color = '#333';
            
            L.DomEvent.on(button, 'click', (e) => {
                L.DomEvent.preventDefault(e);
                this.toggleFullscreen();
            });
            
            return container;
        };
        
        fullscreenControl.addTo(this.map);
    }

    toggleFullscreen() {
        const mapContainer = document.getElementById('map');
        
        if (!document.fullscreenElement) {
            mapContainer.requestFullscreen().then(() => {
                setTimeout(() => {
                    this.map.invalidateSize();
                }, 100);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Add enhanced markers with clustering and performance optimization
    async addMarkers() {
        if (!TRAVEL_DATA.locations) {
            console.warn('No location data available');
            return;
        }

        // Create markers for each location
        for (const [locationKey, locationData] of Object.entries(TRAVEL_DATA.locations)) {
            await this.createEnhancedMarker(locationKey, locationData);
            
            // Yield control to prevent blocking
            if (Object.keys(TRAVEL_DATA.locations).length > 5) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }

        console.log(`📍 Created ${this.markers.size} location markers`);
    }

    async createEnhancedMarker(locationKey, locationData) {
        try {
            const coords = locationData.coords;
            const isBaseLocation = locationData.baseLocation;
            
            // Determine marker styling based on location type
            const markerOptions = this.getMarkerOptions(locationData);
            
            // Create marker
            const marker = L.circleMarker(coords, markerOptions);
            
            // Add enhanced popup
            const popupContent = this.createEnhancedPopupContent(locationData);
            marker.bindPopup(popupContent, {
                maxWidth: 320,
                minWidth: 280,
                closeButton: true,
                autoClose: false,
                className: 'enhanced-popup'
            });

            // Add hover effects
            this.addMarkerInteractions(marker, locationData);
            
            // Add to map and store reference
            marker.addTo(this.map);
            this.markers.set(locationKey, marker);
            
        } catch (error) {
            console.error(`Failed to create marker for ${locationKey}:`, error);
        }
    }

    getMarkerOptions(locationData) {
        const baseRadius = locationData.baseLocation ? 12 : 8;
        const color = this.getLocationColor(locationData);
        
        return {
            radius: baseRadius,
            fillColor: color,
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8,
            // Performance optimization
            bubblingMouseEvents: false
        };
    }

    getLocationColor(locationData) {
        // Color coding based on location and timing
        const colorMap = {
            tokyo: '#ff6b6b',
            kawaguchi: '#ff9f43',
            takayama: '#4ecdc4',
            kyoto: '#45b7d1',
            osaka: '#45b7d1'
        };
        
        // Extract location key from name
        const locationKey = locationData.name.toLowerCase().replace(/[^a-z]/g, '');
        return colorMap[locationKey] || '#667eea';
    }

    createEnhancedPopupContent(locationData) {
        const accommodationSummary = this.getAccommodationSummary(locationData.accommodations);
        const weatherInfo = this.getWeatherInfo(locationData.weather);
        
        return `
            <div class="popup-content">
                <div class="popup-header">
                    <div class="popup-title">${locationData.name}</div>
                    <div class="popup-duration">${locationData.stayDuration} nights • ${locationData.dates.start} to ${locationData.dates.end}</div>
                </div>
                
                <div class="popup-description">
                    ${locationData.description}
                </div>
                
                <div class="popup-highlights">
                    <strong>Winter Highlights:</strong>
                    <ul>
                        ${locationData.winterHighlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                </div>
                
                ${accommodationSummary ? `
                    <div class="popup-accommodation">
                        <strong>Accommodation:</strong>
                        ${accommodationSummary}
                    </div>
                ` : ''}
                
                ${weatherInfo ? `
                    <div class="popup-weather">
                        <strong>Weather:</strong> ${weatherInfo}
                    </div>
                ` : ''}
                
                <div class="popup-actions">
                    <button onclick="japanTravelMap.focusLocation('${locationData.name.toLowerCase().replace(/[^a-z]/g, '')}')" class="popup-focus-btn">
                        Focus on Map
                    </button>
                </div>
            </div>
        `;
    }

    getAccommodationSummary(accommodations) {
        if (!accommodations) return null;
        
        const tiers = ['luxury', 'midRange', 'budget'];
        const available = tiers.filter(tier => accommodations[tier] && accommodations[tier].length > 0);
        
        if (available.length === 0) return null;
        
        return `${available.length} price tier${available.length > 1 ? 's' : ''} available`;
    }

    getWeatherInfo(weather) {
        if (!weather) return null;
        
        return `${weather.avgTemp.low}°C to ${weather.avgTemp.high}°C, ${weather.conditions}`;
    }

    addMarkerInteractions(marker, locationData) {
        const originalRadius = marker.options.radius;
        
        marker.on('mouseover', () => {
            marker.setStyle({
                radius: originalRadius + 3,
                weight: 4,
                fillOpacity: 1
            });
        });

        marker.on('mouseout', () => {
            marker.setStyle({
                radius: originalRadius,
                weight: 3,
                fillOpacity: 0.8
            });
        });

        marker.on('click', () => {
            this.recordInteraction('marker_click', locationData.name);
        });
    }

    // Initialize advanced features (timeline and animations)
    async initializeAdvancedFeatures() {
        try {
            // Initialize Timeline Controller
            this.timelineController = new TimelineController(this, TRAVEL_DATA);
            
            // Initialize Animation Manager
            this.animationManager = new AnimationManager(this, TRAVEL_DATA);
            
            console.log('🎬 Advanced features initialized');
            
        } catch (error) {
            console.error('Failed to initialize advanced features:', error);
            this.logError('Advanced features initialization failed', error);
        }
    }

    // Setup comprehensive event listeners
    setupEventListeners() {
        // Map events
        this.map.on('zoomend', () => {
            this.handleZoomChange();
        });

        this.map.on('moveend', () => {
            this.handleMapMove();
        });

        this.map.on('popupopen', (e) => {
            this.handlePopupOpen(e);
        });

        // Window events
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Custom events
        document.addEventListener('timelineDayChanged', (e) => {
            this.handleTimelineChange(e.detail);
        });

        // Error handling
        window.addEventListener('error', (e) => {
            this.logError('JavaScript error', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Unhandled promise rejection', e.reason);
        });
    }

    handleZoomChange() {
        const zoom = this.map.getZoom();
        
        // Adjust marker sizes based on zoom level
        this.markers.forEach((marker, key) => {
            const baseRadius = TRAVEL_DATA.locations[key]?.baseLocation ? 12 : 8;
            const scaleFactor = Math.max(0.5, Math.min(2, zoom / 8));
            marker.setRadius(baseRadius * scaleFactor);
        });
    }

    handleMapMove() {
        // Update visible markers set for performance optimization
        this.updateVisibleMarkers();
    }

    updateVisibleMarkers() {
        const bounds = this.map.getBounds();
        this.visibleMarkers.clear();
        
        this.markers.forEach((marker, key) => {
            if (bounds.contains(marker.getLatLng())) {
                this.visibleMarkers.add(key);
            }
        });
    }

    handlePopupOpen(e) {
        // Center the map on the popup if on mobile
        if (this.isMobile) {
            setTimeout(() => {
                this.map.panTo(e.popup.getLatLng());
            }, 100);
        }
        
        this.recordInteraction('popup_open');
    }

    handleTimelineChange(detail) {
        const { day, dayData } = detail;
        
        if (dayData?.location) {
            this.currentLocation = dayData.location;
            this.focusOnLocation(dayData.location);
        }
    }

    handleResize() {
        if (this.map) {
            this.map.invalidateSize();
            this.isMobile = window.innerWidth <= 768;
        }
    }

    handleVisibilityChange() {
        // Pause animations when page is not visible
        if (document.hidden && this.animationManager) {
            this.animationManager.stopAnimation();
        }
    }

    // Set initial map view
    setInitialView() {
        // Start with view of all locations
        this.fitBoundsToAllLocations();
        
        // Then focus on Tokyo (first location)
        setTimeout(() => {
            this.focusLocation('tokyo');
        }, 1000);
    }

    fitBoundsToAllLocations() {
        if (this.markers.size === 0) return;
        
        const group = L.featureGroup(Array.from(this.markers.values()));
        this.map.fitBounds(group.getBounds().pad(0.1));
    }

    // Public API methods for external control
    focusLocation(locationKey) {
        const locationData = TRAVEL_DATA.locations[locationKey];
        if (!locationData) {
            console.warn(`Location not found: ${locationKey}`);
            return;
        }

        const coords = locationData.coords;
        const zoomLevel = locationData.baseLocation ? 11 : 13;
        
        this.map.flyTo(coords, zoomLevel, {
            duration: 1.5,
            easeLinearity: 0.25
        });

        // Open popup after animation
        setTimeout(() => {
            const marker = this.markers.get(locationKey);
            if (marker) {
                marker.openPopup();
            }
        }, 1500);
        
        this.recordInteraction('focus_location', locationKey);
    }

    focusOnLocation(locationKey) {
        // Alias for backward compatibility
        this.focusLocation(locationKey);
    }

    showFullRoute() {
        if (this.animationManager) {
            this.animationManager.showCompleteRoute();
        }
        this.recordInteraction('show_full_route');
    }

    // Performance and error tracking
    recordInteraction(type, data = null) {
        if (!this.performanceMetrics.firstInteraction) {
            this.performanceMetrics.firstInteraction = performance.now() - this.performanceMetrics.initStart;
        }
        
        // Log interaction for analytics (could be sent to analytics service)
        console.log(`📊 Interaction: ${type}`, data);
    }

    logError(message, error) {
        const errorInfo = {
            message,
            error: error?.message || error,
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.errors.push(errorInfo);
        console.error('🚨 Error logged:', errorInfo);
        
        // In production, you might want to send this to an error tracking service
    }

    // Loading indicators
    showLoadingIndicator() {
        // Throttle loading indicator to prevent flashing
        if (this.loadingTimeout) return;
        
        this.loadingTimeout = setTimeout(() => {
            const indicator = document.querySelector('.loading-indicator');
            if (indicator) {
                indicator.style.display = 'block';
            }
        }, 100);
    }

    hideLoadingIndicator() {
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
        
        const indicator = document.querySelector('.loading-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // Error display
    showError(message) {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        mapContainer.innerHTML = `
            <div class="map-error">
                <div class="error-content">
                    <h3>⚠️ Map Loading Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="retry-btn">
                        Retry Loading
                    </button>
                </div>
            </div>
        `;
    }

    // Cleanup and destroy
    destroy() {
        // Stop all animations
        if (this.animationManager) {
            this.animationManager.destroy();
        }
        
        // Destroy timeline controller
        if (this.timelineController) {
            this.timelineController.destroy();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Clear markers
        this.markers.clear();
        
        // Remove map
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        
        this.isInitialized = false;
    }

    // Debug and development helpers
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    getErrorLog() {
        return [...this.errors];
    }

    getCurrentState() {
        return {
            isInitialized: this.isInitialized,
            currentLocation: this.currentLocation,
            visibleMarkersCount: this.visibleMarkers.size,
            mapCenter: this.map?.getCenter(),
            mapZoom: this.map?.getZoom()
        };
    }
}

// Global functions for HTML onclick handlers
function focusLocation(lat, lng, name) {
    if (window.japanTravelMap && window.japanTravelMap.isInitialized) {
        // Convert coordinates to location key
        const locationKey = name.toLowerCase().replace(/[^a-z]/g, '');
        window.japanTravelMap.focusLocation(locationKey);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Check for required dependencies
        if (typeof L === 'undefined') {
            throw new Error('Leaflet library not loaded');
        }

        if (typeof TRAVEL_DATA === 'undefined') {
            throw new Error('Travel data not loaded');
        }

        // Create and initialize the enhanced map
        window.japanTravelMap = new EnhancedJapanTravelMap();
        await window.japanTravelMap.init();

        // Add helpful console messages
        console.log('💡 Interactive features:');
        console.log('  • Use timeline slider to explore day-by-day');
        console.log('  • Click markers for detailed information');
        console.log('  • Use keyboard: Space=play/pause, Arrows=navigate');
        console.log('🆓 This map uses only free, open-source technologies!');
        
        // Development helpers
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🔧 Development mode - additional debugging available');
            window.mapDebug = {
                getPerformanceMetrics: () => window.japanTravelMap.getPerformanceMetrics(),
                getErrors: () => window.japanTravelMap.getErrorLog(),
                getState: () => window.japanTravelMap.getCurrentState()
            };
        }

    } catch (error) {
        console.error('Failed to initialize Japan Travel Map:', error);
        
        // Show fallback content
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-fallback">
                    <h3>🗾 Japan Winter Adventure 2025</h3>
                    <p>Interactive map is temporarily unavailable.</p>
                    <p>Please check your internet connection and refresh the page.</p>
                    <button onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }
    }
});

// Handle page visibility for performance optimization
document.addEventListener('visibilitychange', function() {
    if (window.japanTravelMap && window.japanTravelMap.animationManager) {
        if (document.hidden) {
            window.japanTravelMap.animationManager.stopAnimation();
        }
    }
});

// Handle window unload for cleanup
window.addEventListener('beforeunload', function() {
    if (window.japanTravelMap) {
        window.japanTravelMap.destroy();
    }
});