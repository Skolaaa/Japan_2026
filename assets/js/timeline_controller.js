// Timeline Controller Module - Manages interactive timeline functionality
// Handles day-by-day navigation, play/pause controls, and timeline updates

class TimelineController {
    constructor(mapInstance, travelData) {
        this.map = mapInstance;
        this.travelData = travelData;
        this.currentDay = 1;
        this.isPlaying = false;
        this.playInterval = null;
        this.playSpeed = 1500; // milliseconds per day
        
        // Timeline elements
        this.slider = null;
        this.playButton = null;
        this.resetButton = null;
        this.fullRouteButton = null;
        this.currentDaySpan = null;
        this.currentDateSpan = null;
        this.currentLocationSpan = null;
        
        this.initialize();
    }

    initialize() {
        try {
            this.bindElements();
            this.setupEventListeners();
            this.updateDisplay();
            console.log('📅 Timeline Controller initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Timeline Controller:', error);
        }
    }

    bindElements() {
        this.slider = document.getElementById('timeline-slider');
        this.playButton = document.getElementById('play-pause');
        this.resetButton = document.getElementById('reset-timeline');
        this.fullRouteButton = document.getElementById('show-full-route');
        this.currentDaySpan = document.getElementById('current-day');
        this.currentDateSpan = document.getElementById('current-date');
        this.currentLocationSpan = document.getElementById('current-location');

        if (!this.slider) {
            throw new Error('Timeline slider element not found');
        }
    }

    setupEventListeners() {
        // Slider input event
        this.slider.addEventListener('input', (e) => {
            this.currentDay = parseInt(e.target.value);
            this.updateDisplay();
            this.notifyDayChange();
        });

        // Slider change event (for accessibility - keyboard navigation)
        this.slider.addEventListener('change', (e) => {
            this.currentDay = parseInt(e.target.value);
            this.updateDisplay();
            this.notifyDayChange();
        });

        // Play/Pause button
        if (this.playButton) {
            this.playButton.addEventListener('click', () => {
                this.togglePlayback();
            });
        }

        // Reset button
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => {
                this.resetTimeline();
            });
        }

        // Full route button
        if (this.fullRouteButton) {
            this.fullRouteButton.addEventListener('click', () => {
                this.showFullRoute();
            });
        }

        // Timeline marker clicks
        const markers = document.querySelectorAll('.marker');
        markers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                const day = parseInt(e.target.dataset.day);
                if (day) {
                    this.jumpToDay(day);
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return; // Don't interfere with input fields
            
            switch (e.key) {
                case ' ':
                case 'Space':
                    e.preventDefault();
                    this.togglePlayback();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousDay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextDay();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.resetTimeline();
                    break;
                case 'End':
                    e.preventDefault();
                    this.jumpToDay(21);
                    break;
            }
        });
    }

    updateDisplay() {
        // Update slider value
        if (this.slider) {
            this.slider.value = this.currentDay;
        }

        // Get current day data
        const dayData = this.getDayData(this.currentDay);
        
        // Update display elements
        if (this.currentDaySpan) {
            this.currentDaySpan.textContent = `Day ${this.currentDay}`;
        }
        
        if (this.currentDateSpan && dayData) {
            this.currentDateSpan.textContent = this.formatDate(dayData.date);
        }
        
        if (this.currentLocationSpan && dayData) {
            const location = this.getLocationDisplayName(dayData.location);
            this.currentLocationSpan.textContent = location;
        }

        // Update timeline markers highlighting
        this.updateMarkerHighlights();
    }

    getDayData(day) {
        if (!this.travelData.dailyPlans) {
            // Fallback to location data if daily plans not available
            return this.generateDayDataFromLocations(day);
        }
        
        return this.travelData.dailyPlans.find(plan => plan.day === day);
    }

    generateDayDataFromLocations(day) {
        // Generate basic day data from location information
        const startDate = new Date('2025-01-18');
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (day - 1));
        
        let location = 'tokyo';
        if (day >= 8 && day <= 10) location = 'kawaguchi';
        else if (day >= 11 && day <= 14) location = 'takayama';
        else if (day >= 15 && day <= 18) location = 'kyoto';
        else if (day >= 19) location = 'osaka';
        
        return {
            day: day,
            date: currentDate.toISOString().split('T')[0],
            location: location,
            title: `Day ${day} in ${this.getLocationDisplayName(location)}`
        };
    }

    getLocationDisplayName(locationKey) {
        const locationNames = {
            tokyo: 'Tokyo',
            kawaguchi: 'Kawaguchi-ko',
            takayama: 'Takayama',
            kyoto: 'Kyoto',
            osaka: 'Osaka'
        };
        return locationNames[locationKey] || locationKey;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    updateMarkerHighlights() {
        const markers = document.querySelectorAll('.marker');
        markers.forEach(marker => {
            const markerDay = parseInt(marker.dataset.day);
            if (markerDay && this.currentDay >= markerDay) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }

    togglePlayback() {
        if (this.isPlaying) {
            this.pausePlayback();
        } else {
            this.startPlayback();
        }
    }

    startPlayback() {
        if (this.currentDay >= 21) {
            this.resetTimeline();
        }

        this.isPlaying = true;
        this.updatePlayButton();
        
        this.playInterval = setInterval(() => {
            if (this.currentDay >= 21) {
                this.pausePlayback();
                return;
            }
            
            this.nextDay();
        }, this.playSpeed);

        // Announce playback start for screen readers
        this.announceToScreenReader('Timeline playback started');
    }

    pausePlayback() {
        this.isPlaying = false;
        this.updatePlayButton();
        
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }

        // Announce playback pause for screen readers
        this.announceToScreenReader('Timeline playback paused');
    }

    updatePlayButton() {
        if (!this.playButton) return;
        
        const icon = this.playButton.querySelector('.icon');
        const text = this.playButton.querySelector('.text');
        
        if (this.isPlaying) {
            if (icon) icon.textContent = '⏸️';
            if (text) text.textContent = 'Pause';
            this.playButton.setAttribute('aria-label', 'Pause timeline animation');
        } else {
            if (icon) icon.textContent = '▶️';
            if (text) text.textContent = 'Play Route';
            this.playButton.setAttribute('aria-label', 'Play timeline animation');
        }
    }

    resetTimeline() {
        this.pausePlayback();
        this.jumpToDay(1);
        this.announceToScreenReader('Timeline reset to beginning');
    }

    jumpToDay(day) {
        const targetDay = Math.max(1, Math.min(21, day));
        this.currentDay = targetDay;
        this.updateDisplay();
        this.notifyDayChange();
    }

    nextDay() {
        if (this.currentDay < 21) {
            this.jumpToDay(this.currentDay + 1);
        }
    }

    previousDay() {
        if (this.currentDay > 1) {
            this.jumpToDay(this.currentDay - 1);
        }
    }

    showFullRoute() {
        // Notify map to show full route
        if (this.map && typeof this.map.showFullRoute === 'function') {
            this.map.showFullRoute();
        }
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('showFullRoute'));
        
        this.announceToScreenReader('Showing complete travel route');
    }

    notifyDayChange() {
        const dayData = this.getDayData(this.currentDay);
        
        // Dispatch custom event with day data
        document.dispatchEvent(new CustomEvent('timelineDayChanged', {
            detail: {
                day: this.currentDay,
                dayData: dayData
            }
        }));

        // Focus map on current location
        if (this.map && dayData && typeof this.map.focusOnLocation === 'function') {
            this.map.focusOnLocation(dayData.location);
        }
    }

    // Accessibility helper
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Public API methods
    getCurrentDay() {
        return this.currentDay;
    }

    getCurrentDayData() {
        return this.getDayData(this.currentDay);
    }

    setPlaySpeed(speed) {
        this.playSpeed = Math.max(500, Math.min(5000, speed)); // Limit between 0.5-5 seconds
        
        // If currently playing, restart with new speed
        if (this.isPlaying) {
            this.pausePlayback();
            this.startPlayback();
        }
    }

    // Cleanup method
    destroy() {
        this.pausePlayback();
        
        // Remove event listeners
        if (this.slider) {
            this.slider.removeEventListener('input', this.handleSliderInput);
            this.slider.removeEventListener('change', this.handleSliderChange);
        }
        
        // Clear references
        this.map = null;
        this.travelData = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimelineController;
}

// Add CSS for screen reader only content
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        .marker.active {
            background: var(--color-primary, #667eea);
            color: white;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
}