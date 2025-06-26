// Animation Manager Module - Handles map animations and route progression
// Manages Leaflet.js animation plugins for enhanced visual experience

class AnimationManager {
    constructor(mapInstance, travelData) {
        this.map = mapInstance;
        this.travelData = travelData;
        
        // Animation state
        this.animatedRoutes = [];
        this.routeDecorators = [];
        this.isAnimating = false;
        this.currentAnimationStep = 0;
        
        // Animation configuration
        this.config = {
            snakeSpeed: 200,        // pixels per second
            snakePause: 800,        // milliseconds between segments
            arrowRepeat: 50,        // pixels between arrows
            arrowSize: 12,          // pixel size of arrows
            fadeInDuration: 500,    // milliseconds for fade effects
            zoomDuration: 1000      // milliseconds for zoom animations
        };
        
        // Route segments for animation
        this.routeSegments = [];
        
        this.initialize();
    }

    initialize() {
        try {
            this.setupRouteSegments();
            this.setupEventListeners();
            console.log('🎬 Animation Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Animation Manager:', error);
        }
    }

    setupRouteSegments() {
        // Define route segments with coordinates and styling
        this.routeSegments = [
            {
                id: 'tokyo-to-fuji',
                from: [35.6762, 139.6503], // Tokyo
                to: [35.5131, 138.7697],   // Kawaguchi-ko
                color: '#ff6b6b',
                weight: 4,
                days: [1, 8],
                description: 'Tokyo to Mt. Fuji area'
            },
            {
                id: 'fuji-to-alps',
                from: [35.5131, 138.7697], // Kawaguchi-ko
                to: [36.1428, 137.2531],   // Takayama
                color: '#ff9f43',
                weight: 4,
                days: [8, 11],
                description: 'Mt. Fuji to Japanese Alps'
            },
            {
                id: 'alps-to-kyoto',
                from: [36.1428, 137.2531], // Takayama
                to: [35.0116, 135.7681],   // Kyoto
                color: '#4ecdc4',
                weight: 4,
                days: [11, 15],
                description: 'Japanese Alps to Kyoto'
            },
            {
                id: 'kyoto-to-osaka',
                from: [35.0116, 135.7681], // Kyoto
                to: [34.6937, 135.5023],   // Osaka
                color: '#45b7d1',
                weight: 4,
                days: [15, 19],
                description: 'Kyoto to Osaka'
            }
        ];
    }

    setupEventListeners() {
        // Listen for timeline changes
        document.addEventListener('timelineDayChanged', (e) => {
            this.handleTimelineChange(e.detail);
        });

        // Listen for full route requests
        document.addEventListener('showFullRoute', () => {
            this.showCompleteRoute();
        });

        // Listen for map ready event
        document.addEventListener('mapReady', () => {
            this.initializeAnimations();
        });
    }

    initializeAnimations() {
        // Clear any existing animations
        this.clearAllAnimations();
        
        // Set up initial state
        this.showProgressiveRoute(1);
    }

    handleTimelineChange(detail) {
        const { day, dayData } = detail;
        this.showProgressiveRoute(day);
        
        // Focus on current location with smooth animation
        if (dayData && dayData.location) {
            this.focusOnLocationAnimated(dayData.location);
        }
    }

    showProgressiveRoute(currentDay) {
        // Clear existing animations
        this.clearAllAnimations();
        
        // Show route segments up to current day
        this.routeSegments.forEach((segment, index) => {
            if (currentDay >= segment.days[0]) {
                this.addRouteSegment(segment, currentDay >= segment.days[1]);
            }
        });
    }

    addRouteSegment(segment, isComplete) {
        const routeCoords = [segment.from, segment.to];
        
        // Create the route polyline
        const route = L.polyline(routeCoords, {
            color: segment.color,
            weight: segment.weight,
            opacity: 0.8,
            smoothFactor: 1.0
        });
        
        // Add to map
        route.addTo(this.map);
        
        // Store reference
        this.animatedRoutes.push(route);
        
        // Add snake animation if route is being traveled
        if (isComplete && typeof route.snakeIn === 'function') {
            // Snake animation for completed segments
            setTimeout(() => {
                route.snakeIn();
            }, this.routeSegments.indexOf(segment) * this.config.snakePause);
        }
        
        // Add directional arrows for completed segments
        if (isComplete && typeof L.polylineDecorator === 'function') {
            this.addDirectionalArrows(route, segment);
        }
        
        // Add popup with segment information
        this.addSegmentPopup(route, segment);
    }

    addDirectionalArrows(route, segment) {
        try {
            const decorator = L.polylineDecorator(route, {
                patterns: [
                    {
                        offset: '10px',
                        repeat: `${this.config.arrowRepeat}px`,
                        symbol: L.Symbol.arrowHead({
                            pixelSize: this.config.arrowSize,
                            pathOptions: {
                                fillOpacity: 0.8,
                                weight: 0,
                                color: segment.color
                            }
                        })
                    }
                ]
            });
            
            decorator.addTo(this.map);
            this.routeDecorators.push(decorator);
        } catch (error) {
            console.warn('Polyline decorator not available:', error);
        }
    }

    addSegmentPopup(route, segment) {
        const popupContent = `
            <div class="route-popup">
                <div class="popup-title">${segment.description}</div>
                <div class="popup-days">Days ${segment.days[0]} - ${segment.days[1]}</div>
                <div class="popup-distance">
                    <strong>Distance:</strong> ${this.calculateDistance(segment.from, segment.to)} km
                </div>
            </div>
        `;
        
        route.bindPopup(popupContent, {
            maxWidth: 250,
            closeButton: false,
            className: 'route-segment-popup'
        });
    }

    focusOnLocationAnimated(locationKey) {
        const locationData = this.travelData.locations[locationKey];
        if (!locationData) return;
        
        const coords = locationData.coords;
        const zoomLevel = locationData.baseLocation ? 10 : 12;
        
        // Smooth animated pan and zoom
        this.map.flyTo(coords, zoomLevel, {
            duration: this.config.zoomDuration / 1000, // Leaflet expects seconds
            easeLinearity: 0.25
        });
        
        // Add a temporary highlight marker
        this.addTemporaryHighlight(coords, locationData.name);
    }

    addTemporaryHighlight(coords, name) {
        // Create a pulsing circle marker
        const highlight = L.circleMarker(coords, {
            radius: 20,
            fillColor: '#fff',
            color: '#667eea',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.3,
            className: 'location-highlight'
        });
        
        highlight.addTo(this.map);
        
        // Add popup
        highlight.bindPopup(`
            <div class="highlight-popup">
                <strong>${name}</strong>
                <br>Current focus location
            </div>
        `).openPopup();
        
        // Remove after a few seconds
        setTimeout(() => {
            this.map.removeLayer(highlight);
        }, 3000);
        
        // Add CSS animation
        this.addHighlightAnimation();
    }

    addHighlightAnimation() {
        // Only add the CSS once
        if (!document.querySelector('#highlight-animation-style')) {
            const style = document.createElement('style');
            style.id = 'highlight-animation-style';
            style.textContent = `
                .location-highlight {
                    animation: locationPulse 2s ease-in-out infinite;
                }
                
                @keyframes locationPulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.7;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showCompleteRoute() {
        // Clear existing animations
        this.clearAllAnimations();
        
        // Show all route segments at once
        this.routeSegments.forEach((segment, index) => {
            setTimeout(() => {
                this.addRouteSegment(segment, true);
            }, index * 300); // Stagger the additions
        });
        
        // Fit map to show entire route
        setTimeout(() => {
            this.fitMapToRoute();
        }, this.routeSegments.length * 300 + 500);
    }

    animateFullJourney() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentAnimationStep = 0;
        
        // Clear existing routes
        this.clearAllAnimations();
        
        // Animate each segment in sequence
        this.animateNextSegment();
    }

    animateNextSegment() {
        if (this.currentAnimationStep >= this.routeSegments.length) {
            this.isAnimating = false;
            return;
        }
        
        const segment = this.routeSegments[this.currentAnimationStep];
        
        // Focus on start of segment
        this.map.flyTo(segment.from, 9, {
            duration: 1,
            easeLinearity: 0.25
        });
        
        setTimeout(() => {
            // Add and animate the segment
            this.addRouteSegment(segment, true);
            
            // Move to next segment
            this.currentAnimationStep++;
            setTimeout(() => {
                this.animateNextSegment();
            }, this.config.snakePause * 2);
            
        }, 1000);
    }

    fitMapToRoute() {
        // Create a group of all route coordinates
        const allCoords = [];
        this.routeSegments.forEach(segment => {
            allCoords.push(segment.from, segment.to);
        });
        
        if (allCoords.length > 0) {
            const group = L.featureGroup(this.animatedRoutes);
            this.map.fitBounds(group.getBounds().pad(0.1), {
                duration: this.config.zoomDuration / 1000
            });
        }
    }

    calculateDistance(from, to) {
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(to[0] - from[0]);
        const dLon = this.toRadians(to[1] - from[1]);
        const lat1 = this.toRadians(from[0]);
        const lat2 = this.toRadians(to[0]);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return Math.round(R * c);
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    clearAllAnimations() {
        // Remove animated routes
        this.animatedRoutes.forEach(route => {
            this.map.removeLayer(route);
        });
        this.animatedRoutes = [];
        
        // Remove decorators
        this.routeDecorators.forEach(decorator => {
            this.map.removeLayer(decorator);
        });
        this.routeDecorators = [];
        
        // Reset animation state
        this.isAnimating = false;
        this.currentAnimationStep = 0;
    }

    // Configuration methods
    setAnimationSpeed(speed) {
        this.config.snakeSpeed = Math.max(50, Math.min(500, speed));
    }

    setSnakePause(pause) {
        this.config.snakePause = Math.max(200, Math.min(2000, pause));
    }

    // Public API methods
    playRouteAnimation() {
        this.animateFullJourney();
    }

    stopAnimation() {
        this.isAnimating = false;
        this.clearAllAnimations();
    }

    getAnimationState() {
        return {
            isAnimating: this.isAnimating,
            currentStep: this.currentAnimationStep,
            totalSteps: this.routeSegments.length
        };
    }

    // Cleanup method
    destroy() {
        this.clearAllAnimations();
        
        // Remove event listeners
        document.removeEventListener('timelineDayChanged', this.handleTimelineChange);
        document.removeEventListener('showFullRoute', this.showCompleteRoute);
        document.removeEventListener('mapReady', this.initializeAnimations);
        
        // Clear references
        this.map = null;
        this.travelData = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}