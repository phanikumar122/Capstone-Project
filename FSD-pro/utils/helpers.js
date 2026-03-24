/**
 * Crime Reporting App - Helper Functions
 * Utility functions for common operations
 */

const Helpers = {
    /**
     * Format date/time for display
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate(date) {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    },

    /**
     * Format file size
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Convert canvas to base64 image
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @returns {string} Base64 image data
     */
    canvasToBase64(canvas) {
        return canvas.toDataURL('image/jpeg', 0.8);
    },

    /**
     * Validate file size
     * @param {File} file - File to validate
     * @param {number} maxSize - Max size in MB
     * @returns {boolean} Is valid
     */
    isValidFileSize(file, maxSize = 50) {
        return file.size <= (maxSize * 1024 * 1024);
    },

    /**
     * Validate file type
     * @param {File} file - File to validate
     * @returns {boolean} Is valid media file
     */
    isValidMediaFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
        return validTypes.includes(file.type);
    },

    /**
     * Read file as data URL
     * @param {File} file - File to read
     * @returns {Promise<string>} Data URL
     */
    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    /**
     * Check if browser supports required APIs
     * @returns {Object} API support status
     */
    getBrowserCapabilities() {
        return {
            mediaDevices: !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia,
            canvas: !!document.createElement('canvas').getContext('2d'),
            blob: !!window.Blob,
            localStorage: !!window.localStorage,
            mediaRecorder: !!window.MediaRecorder,
            fileReader: !!window.FileReader,
            objectUrl: !!window.URL && !!window.URL.createObjectURL
        };
    },

    /**
     * Get permission status for camera
     * @returns {Promise<string>} Permission status
     */
    async getCameraPermissionStatus() {
        if (!navigator.permissions) return 'unknown';
        
        try {
            const result = await navigator.permissions.query({ name: 'camera' });
            return result.state;
        } catch (error) {
            return 'unknown';
        }
    },

    /**
     * Format crime type for display
     * @param {string} type - Crime type
     * @returns {string} Formatted crime type
     */
    formatCrimeType(type) {
        return StorageManager.formatCrimeType(type);
    },

    /**
     * Get badge class for crime type
     * @param {string} type - Crime type
     * @returns {string} Badge class
     */
    getCrimeBadgeClass(type) {
        return `badge-${type}`;
    },

    /**
     * Get icon for crime type
     * @param {string} type - Crime type
     * @returns {string} Font Awesome icon class
     */
    getCrimeIcon(type) {
        const icons = {
            'theft': 'fas fa-hand-fist',
            'assault': 'fas fa-fist-raised',
            'robbery': 'fas fa-gun',
            'vandalism': 'fas fa-spray-can',
            'fraud': 'fas fa-credit-card',
            'burglary': 'fas fa-door-open',
            'hit_run': 'fas fa-car-crash',
            'suspicious': 'fas fa-eye',
            'other': 'fas fa-exclamation-circle'
        };
        return icons[type] || 'fas fa-alert-circle';
    },

    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} max - Max length
     * @returns {string} Truncated text
     */
    truncateText(text, max = 100) {
        return text.length > max ? text.substring(0, max) + '...' : text;
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} elem - Element to check
     * @returns {boolean} Is in viewport
     */
    isInViewport(elem) {
        const rect = elem.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
    },

    /**
     * Smooth scroll to element
     * @param {HTMLElement|string} target - Element or selector
     */
    smoothScrollTo(target) {
        const elem = typeof target === 'string' ? document.querySelector(target) : target;
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
        }
    },

    /**
     * Generate random dummy report (for simulation)
     * @returns {Object} Dummy report
     */
    generateDummyReport() {
        const crimeTypes = ['theft', 'assault', 'robbery', 'vandalism', 'fraud', 'burglary', 'hit_run', 'suspicious'];
        const locations = [
            'Downtown Center', 'Main Street', 'Market Square', 'Park Avenue',
            'City Hall', 'Shopping District', 'Riverside', 'Northside',
            'Industrial Zone', 'Residential Area', 'Highway Intersection', 'Transit Station'
        ];
        const descriptions = [
            'Suspicious activity near the area.',
            'Report of potential incident.',
            'Unconfirmed report received.',
            'Situation under observation.',
            'Incident reported by witness.',
            'Multiple witnesses reported incident.',
            'Alert issued for the area.',
            'Investigation initiated.'
        ];

        const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];

        return {
            crimeType: type,
            location: location,
            description: description,
            anonymous: Math.random() > 0.5,
            media: null,
            reported_by: 'Anonymous' + Math.floor(Math.random() * 1000)
        };
    },

    /**
     * Create HTML for crime card
     * @param {Object} report - Report object
     * @returns {string} HTML string
     */
    createCrimeCardHTML(report) {
        const crimeType = StorageManager.formatCrimeType(report.crimeType);
        const icon = this.getCrimeIcon(report.crimeType);
        const badgeClass = this.getCrimeBadgeClass(report.crimeType);
        const timestamp = this.formatDate(report.timestamp);
        const anonymous = report.anonymous || report.reported_by === 'Anonymous';
        const reporter = anonymous ? 'Anonymous' : (report.reported_by || 'Anonymous');

        let mediaHTML = '';
        if (report.media) {
            if (report.media.startsWith('data:image')) {
                mediaHTML = `<img src="${report.media}" class="crime-card-media" alt="Crime evidence">`;
            } else if (report.media.startsWith('data:video') || report.media.startsWith('blob:')) {
                mediaHTML = `<video class="crime-card-media" controls><source src="${report.media}"></video>`;
            }
        }

        return `
            <div class="col-lg-6 col-xl-4">
                <div class="card crime-card h-100">
                    <div class="card-header">
                        <div>
                            <span class="crime-badge ${badgeClass}">
                                <i class="${icon}"></i> ${crimeType}
                            </span>
                        </div>
                        <small class="text-muted">${timestamp}</small>
                    </div>
                    ${mediaHTML}
                    <div class="card-body">
                        <div class="crime-meta">
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${report.location}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-user"></i>
                                <span>${reporter}</span>
                            </div>
                        </div>
                        <p class="card-text text-truncate-2">${report.description}</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in ms
     * @returns {Function} Debounced function
     */
    debounce(func, delay = 300) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - Bootstrap alert type
     * @param {number} duration - Duration in ms (0 = permanent)
     */
    showToast(message, type = 'info', duration = 3000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Add to body with custom positioning
        const container = document.querySelector('.main-content') || document.body;
        container.insertAdjacentElement('afterbegin', alertDiv);

        if (duration > 0) {
            setTimeout(() => {
                alertDiv.remove();
            }, duration);
        }

        return alertDiv;
    },

    /**
     * Show modal alert
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     */
    showModalAlert(title, message) {
        const modal = document.getElementById('alertModal');
        document.getElementById('alertTitle').textContent = title;
        document.getElementById('alertMessage').textContent = message;
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Helpers;
}
