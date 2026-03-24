# Crime Reporting App - Frontend-Only Implementation

A fully functional, frontend-only crime reporting application built with HTML5, Bootstrap 5, and vanilla JavaScript. This application allows users to capture images/videos using their device camera, upload media files, and report crimes with real-time updates using only browser APIs and localStorage.

## 🎯 Features

### Core Functionality
- **Live Camera Capture**: Access device camera using `navigator.mediaDevices.getUserMedia` API
- **Photo Capture**: Capture photos from live camera stream using canvas
- **Video Recording**: Record videos with audio using MediaRecorder API
- **File Upload**: Upload image or video files directly
- **Media Preview**: Preview captured/uploaded media before submission
- **Crime Reporting Form**: Submit detailed crime reports with media evidence
- **Activity Feed**: Display all submitted crime reports dynamically
- **Real-time Simulation**: Generate dummy reports every 5-8 seconds to simulate live updates
- **Filter & Search**: Filter by crime type and search by location
- **Dashboard**: View statistics and recent activity
- **Dark/Light Theme Toggle**: Switch between themes with persistent preference
- **LocalStorage Persistence**: All reports stored locally, persists across sessions

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Bootstrap 5**: Modern, clean UI with Bootstrap components
- **Smooth Animations**: Transitions and fade effects for better UX
- **Toast Notifications**: Real-time feedback on user actions
- **Modal Alerts**: Important messages and confirmations
- **Dynamic Updates**: No page reload required for any action

## 🏗️ Project Structure

```
FSD-pro/
├── index.html           # Main HTML file with all UI components
├── style.css            # Styling with dark/light theme support
├── app.js               # Main application logic
├── utils/
│   ├── storage.js       # LocalStorage management utility
│   └── helpers.js       # Helper functions and utilities
├── assets/
│   ├── images/          # Image assets folder
│   └── icons/           # Icon assets folder
└── README.md            # Documentation (this file)
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6 support
- Camera/media permissions enabled
- Minimum 50MB free disk space for browser localStorage

### Installation

1. **Clone or Download the Project**
   ```bash
   # If using git
   git clone <repository-url>
   cd FSD-pro
   
   # Or simply extract the downloaded folder
   ```

2. **No Installation Required!**
   - This is a static website with no dependencies
   - No npm install, no build process needed
   - Just open `index.html` in a web browser

3. **Open the Application**
   - **Option 1**: Double-click `index.html` to open in default browser
   - **Option 2**: Right-click `index.html` → Open with → Choose browser
   - **Option 3**: Use a local server (recommended for better compatibility)

### Running with a Local Server (Optional but Recommended)

#### Using Python
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

#### Using Node.js
```bash
# Install http-server globally (one-time)
npm install -g http-server

# Run server
http-server
```

#### Using Live Server (VS Code Extension)
- Install "Live Server" extension in VS Code
- Right-click `index.html` → Open with Live Server

Then open `http://localhost:8000` in your browser.

## 📱 Browser Compatibility

### Required Features
- **ES6 JavaScript Support**: For arrow functions, template literals, etc.
- **MediaDevices API**: For camera access (`getUserMedia`)
- **Canvas API**: For photo capture from video stream
- **MediaRecorder API**: For video recording
- **File Reader API**: For file upload handling
- **LocalStorage API**: For persistent data storage
- **Blob URL**: For media preview and video blob handling

### Tested Browsers
- ✅ Chrome/Edge 70+
- ✅ Firefox 60+
- ✅ Safari 14.1+
- ✅ Opera 57+
- ❌ Internet Explorer (not supported)

## 🎮 How to Use

### 1. Reporting a Crime

#### Using Camera Capture
1. Click "Report Crime" in navigation
2. Go to "Camera" tab
3. Click "Start Camera" button
4. Allow camera permission when prompted
5. Click "Capture Photo" when ready
6. Media appears in preview below
7. Fill in report details (Crime Type, Location, Description)
8. Optionally check "Report Anonymously"
9. Click "Submit Report"

#### Using Video Recording
1. Click "Report Crime" in navigation
2. Go to "Video" tab
3. Click "Start Recording"
4. Allow camera/microphone permission when prompted
5. Recording timer shows elapsed time
6. Click "Stop Recording" when done
7. Video appears in preview
8. Fill in report details
9. Click "Submit Report"

#### Using File Upload
1. Click "Report Crime" in navigation
2. Go to "Upload" tab
3. Click file input and select image or video (max 50MB)
4. File previews automatically
5. Fill in report details
6. Click "Submit Report"

### 2. Viewing Reports

1. Click "Activity Feed" in navigation
2. All submitted crime reports display as cards
3. Each card shows:
   - Media preview (if attached)
   - Crime type badge with color-coding
   - Location
   - Reporter name (or "Anonymous")
   - Time since reported
   - Full description
4. Use filters and search:
   - **Crime Type Filter**: Filter by specific crime types
   - **Location Search**: Search by location or keywords

### 3. Dashboard

1. Click "Dashboard" in navigation
2. View statistics:
   - **Total Reports**: Cumulative crime reports
   - **This Week**: Reports from the last 7 days
   - **Most Common**: Most frequently reported crime type
3. **Recent Activity**: Shows 5 most recent reports with quick details

### 4. Theme Toggle

1. Click moon/sun icon in top-right navbar
2. Interface switches between light and dark themes
3. Preference persists across sessions

## 🔧 JavaScript Architecture

### Class Structure: `CrimeReportingApp`

```javascript
class CrimeReportingApp {
    // State management
    state = {
        theme, currentMedia, mediaType, isRecording, 
        mediaStream, mediaRecorder, recordedChunks, ...
    }

    // Initialization
    init()
    checkCapabilities()
    
    // Theme Management
    toggleTheme()
    loadSettings()
    
    // Navigation
    switchSection(section)
    
    // Camera Features
    startCamera()
    stopCamera()
    capturePhoto()
    
    // Video Features
    startVideoRecording()
    stopVideoRecording()
    startRecordingTimer()
    
    // File Upload
    handleFileUpload()
    
    // Form & Reports
    submitReport()
    
    // Display & Filtering
    loadReports()
    filterReports()
    
    // Dashboard
    updateDashboard()
    updateRecentActivity()
    
    // Real-time Simulation
    startRealtimeSimulation()
    stopRealtimeSimulation()
}
```

### Utility Modules

#### StorageManager (`utils/storage.js`)
Handles all localStorage operations:
- `getAllReports()`: Get all reports
- `saveReport(report)`: Save new report
- `updateReport(id, updates)`: Update report
- `deleteReport(id)`: Delete report
- `getFilteredReports(filters)`: Filter reports
- `getStatistics()`: Get crime statistics
- `getSettings()`: Load user settings
- `saveSettings(settings)`: Save user settings

#### Helpers (`utils/helpers.js`)
Common utility functions:
- `formatDate(date)`: Format date for display
- `formatFileSize(bytes)`: Format file size
- `canvasToBase64(canvas)`: Convert canvas to image
- `isValidFileSize(file, maxSize)`: Validate file size
- `isValidMediaFile(file)`: Validate media type
- `readFileAsDataUrl(file)`: Read file as data URL
- `getBrowserCapabilities()`: Check browser support
- `generateDummyReport()`: Create dummy report (for simulation)
- `createCrimeCardHTML(report)`: Generate HTML for report card
- `showToast(message, type, duration)`: Show notification
- `showModalAlert(title, message)`: Show modal alert

## 💾 Data Storage

### LocalStorage Structure

```javascript
// Key: "crimeReports" - Array of report objects
[
    {
        id: "report_timestamp_random",
        crimeType: "theft",
        location: "Downtown Center",
        description: "Suspicious activity near...",
        anonymous: false,
        media: "data:image/jpeg;base64,...",  // OR null
        timestamp: "2024-03-22T10:30:00Z"
    },
    // ... more reports
]

// Key: "appSettings" - User preferences
{
    theme: "dark"  // or "light"
}
```

### Storage Limits
- **Max per Report**: ~2-5MB (depending on media size)
- **Total Available**: 50MB (browser dependent)
- **Implementation**: Auto cleanup when approaching limit

## 🎨 Styling & Theming

### CSS Features
- **Dark/Light Themes**: CSS custom properties and class-based switching
- **Responsive Grid**: Bootstrap 5 grid system for mobile-first design
- **Animations**: Smooth transitions for theme, cards, and notifications
- **Color Coding**: Crime type badges with distinct colors:
  - 🔴 Theft: #ff6b6b (Red)
  - 🔴 Assault: #ee5a6f (Dark Red)
  - 🟣 Robbery: #c92a2a (Maroon)
  - 🟠 Vandalism: #f76707 (Orange)
  - 🟠 Fraud: #fd7e14 (Light Orange)
  - 🟣 Burglary: #a61e4d (Purple)
  - 🟤 Hit & Run: #862e2e (Brown)
  - 🔵 Suspicious: #364d79 (Blue)

### Breakpoints
- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: 768px - 992px
- **Large**: 992px+

## 🔐 Browser Permissions Required

1. **Camera Permission**: Required for photo and video capture
   - Requested when "Start Camera" or "Start Recording" clicked
   - Can be revoked in browser settings

2. **Microphone Permission**: Required for video recording with audio
   - Requested along with camera permission

3. **Storage Permission**: Required for localStorage
   - Typically granted by default in modern browsers

## ⚠️ Edge Cases Handled

1. **Camera Permission Denied**
   - Modal alert with helpful instruction
   - Graceful fallback to file upload

2. **Unsupported Browser Features**
   - Capability check on app initialization
   - Alert if required features missing

3. **Storage Quota Exceeded**
   - Warning message when approaching limit
   - Auto-cleanup of oldest reports

4. **Invalid File Size/Type**
   - Validation before upload
   - Error messages with helpful hints

5. **Network Unavailable**
   - App works offline using localStorage
   - Data persists for next session

## 🚀 Real-time Simulation

The application includes a real-time simulation feature that generates dummy crime reports every 5-8 seconds. This demonstrates:
- Real-time data updates without page reload
- Automatic dashboard and feed updates
- How the app handles multiple concurrent reports

**Location**: Starts automatically on app initialization in `startRealtimeSimulation()` method.

To disable simulation in development, comment out the line in `init()` method:
```javascript
// this.startRealtimeSimulation();
```

## 🔧 Development & Customization

### Adding New Crime Types

1. Open `index.html`
2. Find the `<select id="crimeType">` element
3. Add new `<option>` element:
   ```html
   <option value="new_type">Display Name</option>
   ```
4. Open `utils/storage.js` and add to `formatCrimeType()`:
   ```javascript
   'new_type': 'Display Name'
   ```
5. Open `utils/helpers.js` and add to `getCrimeIcon()`:
   ```javascript
   'new_type': 'fas fa-icon-name'
   ```
6. Add CSS class in `style.css`:
   ```css
   .badge-new_type {
       background-color: #color;
       color: white;
   }
   ```

### Customizing Colors & Theme

Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #007bff;
    --danger-color: #dc3545;
    --success-color: #28a745;
    --warning-color: #ffc107;
}
```

### Adjusting Real-time Simulation

In `app.js`, modify the interval in `startRealtimeSimulation()`:
```javascript
// Change interval (currently 5-8 seconds)
Math.random() * 3000 + 5000  // min 5000ms, max 8000ms
```

## 📊 Statistics & Analytics

The dashboard provides real-time statistics:
- **Total Reports**: Count of all reports
- **This Week**: Reports from last 7 days
- **Most Common Crime**: Most frequently reported type
- **Recent Activity**: 5 most recent reports

## 📱 API Integration Ready

While the current implementation uses localStorage, the architecture is designed for easy backend integration:

1. **Replace `StorageManager`**: Swap localStorage calls with API calls
   ```javascript
   // Instead of: const reports = localStorage.getItem(...)
   // Use: const reports = await fetch('/api/reports').then(r => r.json())
   ```

2. **Update Form Submission**: Send data to backend
   ```javascript
   // Instead of: StorageManager.saveReport(report)
   // Use: await fetch('/api/reports', {method: 'POST', body: JSON.stringify(report)})
   ```

3. **Real-time Updates**: Replace simulation with WebSocket
   ```javascript
   // Instead of: setInterval(() => {...})
   // Use: socket.on('newReport', report => {...})
   ```

## 🐛 Troubleshooting

### Camera Not Working
- **Check**: Browser permissions (Settings → Camera)
- **Check**: Device has camera hardware
- **Solution**: Try in incognito/private mode
- **Solution**: Try different browser

### Videos Not Saving
- **Check**: Browser supports MediaRecorder API
- **Check**: System has enough storage
- **Solution**: Close other tabs to free memory

### Dark Mode Not Saving
- **Check**: LocalStorage is enabled
- **Solution**: Clear cache and try again
- **Solution**: Check browser privacy settings

### Files Won't Upload
- **Check**: File is image or video
- **Check**: File size < 50MB
- **Check**: File format is supported (JPEG, PNG, GIF, WebP, MP4, WebM)

### Reports Disappearing
- **Check**: LocalStorage quota (browser dependent)
- **Solution**: Clear older reports from storage
- **Solution**: Use incognito mode with fresh storage

## 🌐 Deployment

### Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git" or drag and drop folder
3. Select project directory
4. Click Deploy
5. Your app is live!

### Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Upload folder or connect GitHub repo
4. Click Deploy
5. Your app is live!

### Deploy to GitHub Pages
1. Create repository on GitHub
2. Push project to repository
3. Go to Settings → Pages
4. Select `main` branch as source
5. Your app is live at `https://username.github.io/repo-name/`

## 📝 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and enhance this application. Some ideas for improvements:
- Add geolocation integration
- Implement email notifications
- Add user authentication
- Connect to real backend API
- Add more crime types and statistics
- Implement map visualization
- Add export/print functionality
- Add notification sounds

## ✅ Verification Checklist

Before deploying, verify:
- ✅ Camera capture works on your device
- ✅ Video recording saves properly
- ✅ File upload accepts images and videos
- ✅ Reports save and display correctly
- ✅ Dark/Light theme toggle works
- ✅ Filtering and search function properly
- ✅ Dashboard statistics update
- ✅ LocalStorage persists data
- ✅ App works offline
- ✅ Responsive on mobile devices

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console for error messages
3. Check browser compatibility
4. Try in incognito/private mode
5. Test in different browser

---

**Built with ❤️ using HTML5, Bootstrap 5, and Vanilla JavaScript**

*No frameworks. No backend. No external dependencies. Pure frontend power.*

Happy reporting! 📸🎥
# Capstone-Project
