/**
 * Crime Reporting App - Main Application Logic
 * Handles all interactivity, camera capture, video recording, and state management
 */

class CrimeReportingApp {
    constructor() {
        // State management
        this.state = {
            theme: 'light',
            currentMedia: null,
            mediaType: null, // 'photo', 'video', or 'file'
            isRecording: false,
            recordingStartTime: null,
            recordingTimer: null,
            mediaStream: null,
            mediaRecorder: null,
            recordedChunks: [],
            dummyReportInterval: null
        };

        // DOM Elements cache
        this.elements = {};
        this.cacheElements();

        // Feature detection
        this.capabilities = Helpers.getBrowserCapabilities();
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Crime Reporting App...');

        // Check browser capabilities
        if (!this.checkCapabilities()) {
            return;
        }

        // Load settings
        this.loadSettings();

        // Setup event listeners
        this.setupEventListeners();

        // Load and display stored reports
        this.loadReports();

        // Update dashboard
        this.updateDashboard();

        // Start real-time simulation
        this.startRealtimeSimulation();

        console.log('App initialized successfully');
    }

    /**
     * Cache common DOM elements
     */
    cacheElements() {
        this.elements = {
            // Theme
            themeToggle: document.getElementById('themeToggle'),
            body: document.body,

            // Navigation
            navLinks: document.querySelectorAll('[data-section]'),

            // Camera
            videoPreview: document.getElementById('videoPreview'),
            startCameraBtn: document.getElementById('startCameraBtn'),
            stopCameraBtn: document.getElementById('stopCameraBtn'),
            capturePhotoBtn: document.getElementById('capturePhotoBtn'),

            // Video Recording
            startVideoBtn: document.getElementById('startVideoBtn'),
            stopVideoBtn: document.getElementById('stopVideoBtn'),
            recordingTimer: document.getElementById('recordingTimer'),
            timerText: document.getElementById('timerText'),
            videoRecordPreview: document.getElementById('videoRecordPreview'),

            // File Upload
            fileInput: document.getElementById('fileInput'),

            // Media Preview
            mediaPreviewContainer: document.getElementById('mediaPreviewContainer'),
            mediaPreview: document.getElementById('mediaPreview'),
            clearMediaBtn: document.getElementById('clearMediaBtn'),

            // Form
            crimeForm: document.getElementById('crimeForm'),
            crimeType: document.getElementById('crimeType'),
            location: document.getElementById('location'),
            description: document.getElementById('description'),
            anonymousReport: document.getElementById('anonymousReport'),

            // Dashboard
            totalReports: document.getElementById('totalReports'),
            weekReports: document.getElementById('weekReports'),
            commonCrime: document.getElementById('commonCrime'),
            recentActivityList: document.getElementById('recentActivityList'),

            // Feed
            filterCrimeType: document.getElementById('filterCrimeType'),
            searchLocation: document.getElementById('searchLocation'),
            reportsFeed: document.getElementById('reportsFeed'),

            // Sections
            dashboard: document.getElementById('dashboard'),
            report: document.getElementById('report'),
            feed: document.getElementById('feed')
        };
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Navigation
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });

        // Camera events
        this.elements.startCameraBtn.addEventListener('click', () => this.startCamera());
        this.elements.stopCameraBtn.addEventListener('click', () => this.stopCamera());
        this.elements.capturePhotoBtn.addEventListener('click', () => this.capturePhoto());

        // Video recording events
        this.elements.startVideoBtn.addEventListener('click', () => this.startVideoRecording());
        this.elements.stopVideoBtn.addEventListener('click', () => this.stopVideoRecording());

        // File upload
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        // Clear media
        this.elements.clearMediaBtn.addEventListener('click', () => this.clearMedia());

        // Form submission
        this.elements.crimeForm.addEventListener('submit', (e) => this.submitReport(e));

        // Filter and search
        const debouncedFilter = Helpers.debounce(() => this.filterReports(), 300);
        this.elements.filterCrimeType.addEventListener('change', debouncedFilter);
        this.elements.searchLocation.addEventListener('input', debouncedFilter);
    }

    /**
     * Check browser capabilities
     */
    checkCapabilities() {
        const required = ['mediaDevices', 'canvas', 'localStorage', 'fileReader'];
        const missing = required.filter(cap => !this.capabilities[cap]);

        if (missing.length > 0) {
            const message = `Your browser does not support required features: ${missing.join(', ')}`;
            Helpers.showModalAlert('Browser Compatibility', message);
            console.warn(message, this.capabilities);
            return false;
        }

        return true;
    }

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const isDark = this.elements.body.classList.toggle('dark-theme');
        this.state.theme = isDark ? 'dark' : 'light';

        // Update button icon
        this.elements.themeToggle.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';

        // Save preference
        StorageManager.saveSettings({ theme: this.state.theme });
    }

    /**
     * Load saved theme preference
     */
    loadSettings() {
        const settings = StorageManager.getSettings();
        if (settings.theme === 'dark') {
            this.elements.body.classList.add('dark-theme');
            this.elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            this.state.theme = 'dark';
        }
    }

    /**
     * Switch to a different section
     */
    switchSection(section) {
        // Hide all sections
        this.elements.dashboard.style.display = 'none';
        this.elements.report.style.display = 'none';
        this.elements.feed.style.display = 'none';

        // Show selected section
        switch (section) {
            case 'dashboard':
                this.elements.dashboard.style.display = 'block';
                this.updateDashboard();
                break;
            case 'report':
                this.elements.report.style.display = 'block';
                break;
            case 'feed':
                this.elements.feed.style.display = 'block';
                this.loadReports();
                break;
        }

        // Update nav active state
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) {
                link.classList.add('active');
            }
        });

        // Scroll to section
        Helpers.smoothScrollTo(`#${section}`);
    }

    /**
     * Start camera stream
     */
    async startCamera() {
        try {
            // Stop any existing stream first
            if (this.state.mediaStream) {
                this.stopCamera();
            }

            // Request camera access
            this.state.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });

            // Set video preview source
            this.elements.videoPreview.srcObject = this.state.mediaStream;

            // Update button states
            this.elements.startCameraBtn.disabled = true;
            this.elements.stopCameraBtn.disabled = false;
            this.elements.capturePhotoBtn.disabled = false;

            Helpers.showToast('Camera started successfully', 'success', 2000);
        } catch (error) {
            console.error('Camera access error:', error);
            if (error.name === 'NotAllowedError') {
                Helpers.showModalAlert('Camera Permission',
                    'Camera access was denied. Please enable camera permissions in your browser settings.');
            } else if (error.name === 'NotFoundError') {
                Helpers.showModalAlert('Camera Not Found',
                    'No camera device found. Please check your device.');
            } else {
                Helpers.showToast(`Camera error: ${error.message}`, 'danger', 3000);
            }
        }
    }

    /**
     * Stop camera stream
     */
    stopCamera() {
        if (this.state.mediaStream) {
            this.state.mediaStream.getTracks().forEach(track => track.stop());
            this.elements.videoPreview.srcObject = null;
            this.state.mediaStream = null;
        }

        // Update button states
        this.elements.startCameraBtn.disabled = false;
        this.elements.stopCameraBtn.disabled = true;
        this.elements.capturePhotoBtn.disabled = true;

        Helpers.showToast('Camera stopped', 'info', 1500);
    }

    /**
     * Capture photo from camera stream
     */
    capturePhoto() {
        if (!this.state.mediaStream) {
            Helpers.showToast('Camera is not active', 'warning', 2000);
            return;
        }

        try {
            const canvas = document.createElement('canvas');
            canvas.width = this.elements.videoPreview.videoWidth;
            canvas.height = this.elements.videoPreview.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.elements.videoPreview, 0, 0);

            // Convert to base64
            this.state.currentMedia = Helpers.canvasToBase64(canvas);
            this.state.mediaType = 'photo';

            // Display preview
            this.showMediaPreview(this.state.currentMedia, 'image');

            // Stop camera after capture
            this.stopCamera();

            Helpers.showToast('Photo captured successfully', 'success', 2000);
        } catch (error) {
            console.error('Photo capture error:', error);
            Helpers.showToast(`Capture error: ${error.message}`, 'danger', 3000);
        }
    }

    /**
     * Start video recording
     */
    async startVideoRecording() {
        try {
            if (this.state.mediaStream) {
                this.stopCamera();
            }

            // Request camera access for recording
            this.state.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: true
            });

            // Create MediaRecorder
            this.state.mediaRecorder = new MediaRecorder(this.state.mediaStream, {
                mimeType: 'video/webm'
            });

            this.state.recordedChunks = [];

            // Handle data available
            this.state.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.state.recordedChunks.push(e.data);
                }
            };

            // Handle recording stop
            this.state.mediaRecorder.onstop = () => {
                const blob = new Blob(this.state.recordedChunks, { type: 'video/webm' });
                this.state.currentMedia = URL.createObjectURL(blob);
                this.state.mediaType = 'video';

                // Display preview
                this.showMediaPreview(this.state.currentMedia, 'video');

                // Clean up
                this.state.mediaStream.getTracks().forEach(track => track.stop());
                this.state.mediaStream = null;
                this.state.mediaRecorder = null;
                this.state.recordedChunks = [];

                Helpers.showToast('Video recorded successfully', 'success', 2000);
            };

            // Start recording
            this.state.mediaRecorder.start();
            this.state.isRecording = true;
            this.state.recordingStartTime = Date.now();

            // Update button states
            this.elements.startVideoBtn.disabled = true;
            this.elements.stopVideoBtn.disabled = false;
            this.elements.recordingTimer.style.display = 'block';

            // Start timer
            this.startRecordingTimer();

            Helpers.showToast('Recording started', 'info', 1500);
        } catch (error) {
            console.error('Video recording error:', error);
            Helpers.showToast(`Recording error: ${error.message}`, 'danger', 3000);
        }
    }

    /**
     * Stop video recording
     */
    stopVideoRecording() {
        if (this.state.mediaRecorder && this.state.isRecording) {
            this.state.mediaRecorder.stop();
            this.state.isRecording = false;

            // Stop timer
            if (this.state.recordingTimer) {
                clearInterval(this.state.recordingTimer);
            }
            this.elements.recordingTimer.style.display = 'none';

            // Update button states
            this.elements.startVideoBtn.disabled = false;
            this.elements.stopVideoBtn.disabled = true;
        }
    }

    /**
     * Start recording timer
     */
    startRecordingTimer() {
        let seconds = 0;
        this.state.recordingTimer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            this.elements.timerText.textContent = 
                `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }, 1000);
    }

    /**
     * Handle file upload
     */
    async handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Validate file
            if (!Helpers.isValidMediaFile(file)) {
                Helpers.showToast('Invalid file type. Please upload image or video.', 'warning', 3000);
                return;
            }

            if (!Helpers.isValidFileSize(file, 50)) {
                Helpers.showToast(`File size exceeds 50MB limit. Size: ${Helpers.formatFileSize(file.size)}`, 'warning', 3000);
                return;
            }

            // Read file
            this.state.currentMedia = await Helpers.readFileAsDataUrl(file);
            this.state.mediaType = file.type.startsWith('image/') ? 'photo' : 'video';

            // Display preview
            this.showMediaPreview(this.state.currentMedia, this.state.mediaType === 'photo' ? 'image' : 'video');

            Helpers.showToast(`File uploaded: ${Helpers.formatFileSize(file.size)}`, 'success', 2000);
        } catch (error) {
            console.error('File upload error:', error);
            Helpers.showToast(`Upload error: ${error.message}`, 'danger', 3000);
        }
    }

    /**
     * Show media preview
     */
    showMediaPreview(mediaData, type) {
        this.elements.mediaPreviewContainer.style.display = 'block';
        this.elements.mediaPreview.innerHTML = '';

        if (type === 'image') {
            const img = document.createElement('img');
            img.src = mediaData;
            img.style.width = '100%';
            img.style.maxHeight = '400px';
            img.style.objectFit = 'contain';
            this.elements.mediaPreview.appendChild(img);
        } else if (type === 'video') {
            const video = document.createElement('video');
            video.src = mediaData;
            video.controls = true;
            video.style.width = '100%';
            video.style.maxHeight = '400px';
            video.style.objectFit = 'contain';
            this.elements.mediaPreview.appendChild(video);
        }

        // Scroll to preview
        Helpers.smoothScrollTo(this.elements.mediaPreviewContainer);
    }

    /**
     * Clear current media
     */
    clearMedia() {
        this.state.currentMedia = null;
        this.state.mediaType = null;
        this.elements.mediaPreviewContainer.style.display = 'none';
        this.elements.mediaPreview.innerHTML = '';
        this.elements.fileInput.value = '';

        Helpers.showToast('Media cleared', 'info', 1500);
    }

    /**
     * Submit crime report
     */
    async submitReport(e) {
        e.preventDefault();

        try {
            // Validate form
            if (!this.elements.crimeType.value) {
                Helpers.showToast('Please select a crime type', 'warning', 2000);
                return;
            }
            if (!this.elements.location.value.trim()) {
                Helpers.showToast('Please enter a location', 'warning', 2000);
                return;
            }
            if (!this.elements.description.value.trim()) {
                Helpers.showToast('Please enter a description', 'warning', 2000);
                return;
            }

            // Create report object
            const report = {
                crimeType: this.elements.crimeType.value,
                location: this.elements.location.value.trim(),
                description: this.elements.description.value.trim(),
                anonymous: this.elements.anonymousReport.checked,
                media: this.state.currentMedia,
                timestamp: new Date().toISOString()
            };

            // Save report
            if (StorageManager.saveReport(report)) {
                Helpers.showToast('Report submitted successfully!', 'success', 3000);

                // Reset form
                this.elements.crimeForm.reset();
                this.clearMedia();

                // Update dashboard
                this.updateDashboard();

                // Switch to activity feed
                setTimeout(() => {
                    this.switchSection('feed');
                }, 1500);
            } else {
                Helpers.showToast('Failed to save report. Please try again.', 'danger', 3000);
            }
        } catch (error) {
            console.error('Report submission error:', error);
            Helpers.showToast(`Submission error: ${error.message}`, 'danger', 3000);
        }
    }

    /**
     * Load and display all reports
     */
    loadReports() {
        this.elements.reportsFeed.innerHTML = '';
        const reports = this.filterReports();

        if (reports.length === 0) {
            this.elements.reportsFeed.innerHTML = `
                <div class="col-12">
                    <p class="text-center text-muted py-4">
                        No crime reports match your filters. Be the first to report!
                    </p>
                </div>
            `;
            return;
        }

        // Render reports
        const htmlContent = reports
            .map(report => Helpers.createCrimeCardHTML(report))
            .join('');

        this.elements.reportsFeed.innerHTML = htmlContent;
    }

    /**
     * Filter reports based on user input
     */
    filterReports() {
        const filters = {
            crimeType: this.elements.filterCrimeType.value,
            location: this.elements.searchLocation.value
        };

        return StorageManager.getFilteredReports(filters);
    }

    /**
     * Update dashboard statistics
     */
    updateDashboard() {
        const stats = StorageManager.getStatistics();

        this.elements.totalReports.textContent = stats.total;
        this.elements.weekReports.textContent = stats.thisWeek;
        this.elements.commonCrime.textContent = StorageManager.getMostCommonCrime();

        // Update recent activity
        this.updateRecentActivity();
    }

    /**
     * Update recent activity list
     */
    updateRecentActivity() {
        const reports = StorageManager.getAllReports().slice(0, 5);

        if (reports.length === 0) {
            this.elements.recentActivityList.innerHTML = '<p class="text-muted">No recent activity.</p>';
            return;
        }

        const html = reports
            .map(report => {
                const crimeType = StorageManager.formatCrimeType(report.crimeType);
                const icon = Helpers.getCrimeIcon(report.crimeType);
                const timestamp = Helpers.formatDate(report.timestamp);

                return `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="${icon}"></i>
                        </div>
                        <div class="activity-text">
                            <strong>${crimeType}</strong> reported
                            <br>
                            <small class="text-muted">${report.location}</small>
                        </div>
                        <div class="activity-time">${timestamp}</div>
                    </div>
                `;
            })
            .join('');

        this.elements.recentActivityList.innerHTML = html;
    }

    /**
     * Start real-time simulation of dummy reports
     */
    startRealtimeSimulation() {
        // Generate dummy report every 5-8 seconds
        this.state.dummyReportInterval = setInterval(() => {
            const dummyReport = Helpers.generateDummyReport();
            
            // Save dummy report with modified timestamp (recent)
            dummyReport.timestamp = new Date().toISOString();
            dummyReport.id = StorageManager.generateId();
            
            StorageManager.saveReport(dummyReport);

            // Update dashboard if visible
            if (this.elements.dashboard.style.display !== 'none') {
                this.updateDashboard();
            }

            // Update feed if visible
            if (this.elements.feed.style.display !== 'none') {
                this.loadReports();
            }

            console.log('Dummy report added (simulation)', dummyReport);
        }, Math.random() * 3000 + 5000); // 5-8 seconds
    }

    /**
     * Stop real-time simulation
     */
    stopRealtimeSimulation() {
        if (this.state.dummyReportInterval) {
            clearInterval(this.state.dummyReportInterval);
            this.state.dummyReportInterval = null;
        }
    }

    /**
     * Cleanup on page unload
     */
    cleanup() {
        // Stop camera
        if (this.state.mediaStream) {
            this.state.mediaStream.getTracks().forEach(track => track.stop());
        }

        // Stop recording
        if (this.state.isRecording && this.state.mediaRecorder) {
            this.state.mediaRecorder.stop();
        }

        // Stop timers
        if (this.state.recordingTimer) {
            clearInterval(this.state.recordingTimer);
        }

        // Stop simulation
        this.stopRealtimeSimulation();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    window.app = new CrimeReportingApp();
    await window.app.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.cleanup();
    }
});
