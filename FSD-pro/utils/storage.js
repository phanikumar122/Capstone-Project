/**
 * Crime Reporting App - Storage Utility
 * Handles all localStorage operations
 */

const StorageManager = {
    STORAGE_KEY: 'crimeReports',
    SETTINGS_KEY: 'appSettings',
    MAX_STORAGE: 50 * 1024 * 1024, // 50MB

    /**
     * Get all crime reports from localStorage
     * @returns {Array} Array of crime reports
     */
    getAllReports() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error retrieving reports:', error);
            return [];
        }
    },

    /**
     * Get a single report by ID
     * @param {string} id - Report ID
     * @returns {Object|null} Report object or null
     */
    getReportById(id) {
        const reports = this.getAllReports();
        return reports.find(report => report.id === id) || null;
    },

    /**
     * Save a new crime report
     * @param {Object} report - Report object
     * @returns {boolean} Success status
     */
    saveReport(report) {
        try {
            const reports = this.getAllReports();
            
            // Add ID and timestamp if not present
            if (!report.id) {
                report.id = this.generateId();
            }
            if (!report.timestamp) {
                report.timestamp = new Date().toISOString();
            }

            reports.unshift(report); // Add to beginning for most recent first

            // Check storage size before saving
            const serialized = JSON.stringify(reports);
            if (serialized.length > this.MAX_STORAGE) {
                console.warn('Storage limit approaching. Removing oldest reports.');
                reports.pop(); // Remove oldest report
            }

            localStorage.setItem(this.STORAGE_KEY, serialized);
            return true;
        } catch (error) {
            console.error('Error saving report:', error);
            if (error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded');
            }
            return false;
        }
    },

    /**
     * Update an existing report
     * @param {string} id - Report ID
     * @param {Object} updates - Fields to update
     * @returns {boolean} Success status
     */
    updateReport(id, updates) {
        try {
            const reports = this.getAllReports();
            const index = reports.findIndex(report => report.id === id);
            
            if (index === -1) return false;

            reports[index] = { ...reports[index], ...updates };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));
            return true;
        } catch (error) {
            console.error('Error updating report:', error);
            return false;
        }
    },

    /**
     * Delete a report by ID
     * @param {string} id - Report ID
     * @returns {boolean} Success status
     */
    deleteReport(id) {
        try {
            const reports = this.getAllReports();
            const filtered = reports.filter(report => report.id !== id);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting report:', error);
            return false;
        }
    },

    /**
     * Clear all reports
     * @returns {boolean} Success status
     */
    clearAllReports() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing reports:', error);
            return false;
        }
    },

    /**
     * Get filtered reports
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered reports
     */
    getFilteredReports(filters = {}) {
        let reports = this.getAllReports();

        if (filters.crimeType && filters.crimeType !== '') {
            reports = reports.filter(r => r.crimeType === filters.crimeType);
        }

        if (filters.location && filters.location !== '') {
            const searchTerm = filters.location.toLowerCase();
            reports = reports.filter(r => 
                r.location.toLowerCase().includes(searchTerm) ||
                r.description.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.dateRange) {
            const { start, end } = filters.dateRange;
            reports = reports.filter(r => {
                const reportDate = new Date(r.timestamp);
                return reportDate >= start && reportDate <= end;
            });
        }

        return reports;
    },

    /**
     * Get reports for this week
     * @returns {Array} Reports from this week
     */
    getWeekReports() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        return this.getFilteredReports({
            dateRange: { start: weekAgo, end: now }
        });
    },

    /**
     * Get crime statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const reports = this.getAllReports();
        const stats = {
            total: reports.length,
            thisWeek: this.getWeekReports().length,
            byType: {}
        };

        reports.forEach(report => {
            stats.byType[report.crimeType] = (stats.byType[report.crimeType] || 0) + 1;
        });

        return stats;
    },

    /**
     * Get most common crime type
     * @returns {string} Crime type or 'N/A'
     */
    getMostCommonCrime() {
        const stats = this.getStatistics();
        if (stats.total === 0) return 'N/A';

        let maxType = 'N/A';
        let maxCount = 0;

        Object.entries(stats.byType).forEach(([type, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxType = this.formatCrimeType(type);
            }
        });

        return maxType;
    },

    /**
     * Save app settings
     * @param {Object} settings - Settings object
     * @returns {boolean} Success status
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    },

    /**
     * Get app settings
     * @returns {Object} Settings object
     */
    getSettings() {
        try {
            const data = localStorage.getItem(this.SETTINGS_KEY);
            return data ? JSON.parse(data) : { theme: 'light' };
        } catch (error) {
            console.error('Error retrieving settings:', error);
            return { theme: 'light' };
        }
    },

    /**
     * Get storage usage information
     * @returns {Object} Storage info
     */
    getStorageInfo() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            const size = data ? new Blob([data]).size : 0;
            const percentage = (size / this.MAX_STORAGE) * 100;

            return {
                used: size,
                max: this.MAX_STORAGE,
                percentage: percentage,
                formatted: `${(size / 1024 / 1024).toFixed(2)}MB / ${(this.MAX_STORAGE / 1024 / 1024).toFixed(0)}MB`
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return { used: 0, max: this.MAX_STORAGE, percentage: 0, formatted: '0MB / 50MB' };
        }
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Format crime type for display
     * @param {string} type - Crime type
     * @returns {string} Formatted crime type
     */
    formatCrimeType(type) {
        const types = {
            'theft': 'Theft',
            'assault': 'Assault',
            'robbery': 'Robbery',
            'vandalism': 'Vandalism',
            'fraud': 'Fraud',
            'burglary': 'Burglary',
            'hit_run': 'Hit & Run',
            'suspicious': 'Suspicious Activity',
            'other': 'Other'
        };
        return types[type] || type;
    }
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
