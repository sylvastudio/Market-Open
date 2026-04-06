# Market Open Dashboard

A modern, responsive dashboard for tracking US market indices and top gainers/losers with a downloadable social media format.

## Features

### 📊 **Market Indices**
- Live tracking of key US indices (S&P 500, Dow 30, Nasdaq, Russell 2000, VIX, Gold)
- Real-time updates every 15 minutes
- Color-coded positive/negative changes

### 📈 **Top Gainers & Losers**
- Top 5 overall gainers and losers
- Real-time market data from Yahoo Finance
- Clean, organized display

### 📱 **Downloadable Social Media Format**
- Optimized for social media sharing
- Exact dimensions: 1080px width
- Professional design with consistent branding
- High-quality PNG export

## Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **CSS-in-JS** - Styled components for clean styling

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **node-fetch** - HTTP client for API requests
- **CORS** - Cross-origin resource sharing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd market-open
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

## Usage

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Server will run on `http://localhost:4000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## Routes

- **`/`** - Market Open indices dashboard
- **`/gainers-losers`** - Top gainers and losers
- **`/downloadable`** - Social media optimized view

## Downloading Images

1. Navigate to any page
2. Click the "Download as image" button
3. The page content will be captured and downloaded as a PNG file

For the downloadable view (`/downloadable`), the image will be in the exact social media format with:
- 1080px width
- Professional color scheme (#384D9E background)
- Optimized layout for sharing

## Features

### ✨ **Enhanced UI**
- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive design for all screen sizes
- Professional card-based layout

### 🔄 **Real-time Data**
- Automatic data refresh every 15 minutes
- Rate limiting protection
- Error handling and fallbacks
- Loading states and indicators

### 🎨 **Social Media Ready**
- Exact dimensions for social platforms
- Consistent branding and colors
- High-resolution export
- Professional typography

## API Endpoints

### Backend API
- `GET /api/market-indices` - Returns current market indices data
- `GET /api/gainers-losers` - Returns top gainers and losers

### Data Sources
- **Yahoo Finance** - Primary data source for market data
- **Caching** - 10-15 minute cache to prevent rate limiting
- **Fallback** - Graceful handling of API failures

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include browser version and steps to reproduce

## Notes

- The application uses Yahoo Finance APIs which may have rate limits
- Data is cached to improve performance and avoid API limits
- The downloadable format is optimized for social media sharing
- All styling is responsive and works on mobile devices
