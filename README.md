# Quran Platform

A modern, responsive Islamic web platform for listening to the Holy Quran, watching live Islamic TV broadcasts, and streaming Quran radio stations from around the world.

## Features

- **Listen to Quran**: Choose from various reciters and Quran editions
- **Live Broadcast**: Watch Islamic TV channels (Quran Channel & Sunnah Channel)
- **Radio Stations**: Listen to Quran radio stations from around the world
- **Multi-language**: Full support for Arabic and English
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Bootstrap 5**: Modern UI framework with clean design

## Project Structure

```
project/
├── index.html              # English landing page
├── index-ar.html           # Arabic landing page
├── package.json            # Project dependencies and scripts
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css          # Global styles and theme
│   │   │   ├── home.css          # Home page styles
│   │   │   ├── quran.css         # Quran player styles
│   │   │   ├── live.css          # Live streaming styles
│   │   │   └── radio.css         # Radio player styles
│   │   ├── js/
│   │   │   ├── theme.js          # Theme manager (dark/light mode)
│   │   │   ├── quran-player.js   # Quran audio player logic
│   │   │   ├── live-stream.js    # Live video streaming (HLS)
│   │   │   └── radio-player.js   # Radio streaming player
│   │   ├── fonts/
│   │   │   └── SEGOEUI.TTF       # Custom font
│   │   └── images/               # All project images
│   └── pages/
│       ├── ar/                   # Arabic pages
│       │   ├── quran.html
│       │   ├── live.html
│       │   └── radio.html
│       └── en/                   # English pages
│           ├── quran.html
│           ├── live.html
│           └── radio.html
└── imgs/                         # Legacy images (kept for compatibility)
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **Bootstrap 5**: Responsive framework
- **Vanilla JavaScript**: No jQuery dependencies in new code
- **HLS.js**: For live video streaming
- **MP3 Quran API**: For Quran audio and radio streams

## Getting Started

1. Open `index.html` for English version
2. Open `index-ar.html` for Arabic version
3. No build process required - all files are static

## API Integrations

- **MP3 Quran API**: `https://mp3quran.net/api/v3`
  - Reciters endpoint
  - Suwar (chapters) endpoint
  - Radio stations endpoint

- **Live Streaming**: HLS streams from holol.com
  - Quran Channel
  - Sunnah Channel

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features Details

### Theme System
- Persistent dark/light mode using localStorage
- Smooth transitions between themes
- Applies to all pages and components

### Quran Player
- Fetch reciters dynamically
- Filter by reciter, edition, and surah
- Search functionality for easy navigation
- Auto-play next audio

### Live Streaming
- HLS video streaming support
- Multiple channel selection
- Responsive video player

### Radio Player
- Grid layout for radio stations
- Search and filter functionality
- Visual feedback for active station

## Credits

- Quran data and audio: MP3Quran.net
- Live streaming: Holol.com
- Icons: Google Material Icons
- Framework: Bootstrap 5
