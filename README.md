# TradeSphere Frontend

A modern, responsive stock trading platform built with React and Vite.

## 🚀 Features

- **User Authentication** - Secure login/register with JWT
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dashboard** - Overview with quick actions
- **Popular Stocks** - Live prices for trending stocks
- **Watchlist** - Track your favorite stocks
- **Portfolio Management** - View holdings with P&L
- **Wallet** - Add/withdraw funds with colorful UI
- **Order Management** - Track pending and completed orders
- **Real-time Prices** - Live stock prices via Finnhub API
- **Buy/Sell Form** - Reusable modal component

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd tradesphere-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API URL**

Update `src/api/api.js`:
```javascript
export const API_BASE_URL = "http://localhost:5000";
render_url = "https://tradesphere-backend-oho9.onrender.com"
```

4. **Start development server**
```bash
npm run dev
```

App will run on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── api.js                    # API base URL
│   │   └── watchlist.api.js          # Watchlist API calls
│   ├── components/
│   │   ├── AllOrders.jsx             # Orders list component
│   │   ├── BuyForm.jsx               # Reusable buy form modal
│   │   ├── LogoutButton.jsx          # Logout button
│   │   ├── Navbar.jsx                # Navigation bar
│   │   ├── PortfolioCard.jsx         # Portfolio item card
│   │   └── Sidebar.jsx               # Sidebar navigation
│   ├── context/
│   │   ├── AuthContext.jsx           # Authentication state
│   │   ├── PortfolioContext.jsx      # Portfolio state
│   │   └── WalletContext.jsx         # Wallet state
│   ├── hooks/
│   │   ├── useAuth.js                # Auth hook
│   │   └── useWatchlist.js           # Watchlist hook
│   ├── pages/
│   │   ├── Dashboard.jsx             # Main dashboard
│   │   ├── Login.jsx                 # Login page
│   │   ├── Register.jsx              # Register page
│   │   ├── MainLayout.jsx            # Main layout wrapper
│   │   ├── PopularStocks.jsx         # Popular stocks page
│   │   ├── Watchlist.jsx             # Watchlist page
│   │   ├── Portfolio.jsx             # Portfolio page
│   │   ├── Wallet.jsx                # Wallet page
│   │   ├── SearchStocks.jsx          # Stock search page
│   │   └── StockDetails.jsx          # Stock details page
│   ├── services/
│   │   ├── apiFetch.js               # API fetch utility
│   │   ├── portfolio.service.js      # Portfolio service
│   │   └── trade.service.js          # Trading service
│   ├── utils/
│   │   └── jwtUtils.js               # JWT parsing utility
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # Entry point
│   └── ProtectedRoute.jsx            # Route protection
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 UI Components

### **Dashboard**
- Responsive navbar with hamburger menu
- Search functionality
- Quick action cards
- Welcome banner

### **Popular Stocks**
- Grid layout of trending stocks
- Live prices with change indicators
- Add to watchlist button
- Direct buy functionality

### **Watchlist**
- List of saved stocks
- Real-time prices
- Buy and remove actions
- Add new stocks

### **Portfolio**
- Holdings with quantity and prices
- Profit/Loss calculations
- Sell functionality with form
- Real-time updates

### **Wallet**
- Gradient balance card with animations
- Add/Withdraw money
- Quick add buttons
- Transaction history

### **Orders**
- Pending and completed orders
- Auto-refresh every 5 seconds
- Remove pending orders
- Status indicators

### **Buy Form (Reusable Component)**
- Modal overlay
- Current price display
- Editable buy price and quantity
- Total amount calculation
- Responsive design

## 🔐 Authentication Flow

```
1. User visits app → Redirected to /login
2. Register/Login → JWT token saved to localStorage
3. Token validated → Access granted to protected routes
4. Logout → Token removed → Redirected to login
```

## 📱 Responsive Breakpoints

| Device | Width | Features |
|--------|-------|----------|
| Desktop | >1024px | Full layout, side-by-side components |
| Tablet | 768px-1024px | Compact nav, 2-column grids |
| Mobile | <768px | Hamburger menu, single column |
| Small Mobile | <480px | Extra compact, stacked buttons |

## 🎯 Key Features Explained

### **Order Flow**
1. User clicks "Buy" → Opens BuyForm
2. Enters price/quantity → Confirms
3. Order created with status "pending"
4. After 10 seconds → Status changes to "completed"
5. Portfolio and wallet updated

### **Real-time Updates**
- Portfolio: Fetches live prices on load
- Orders: Auto-refreshes every 5 seconds
- Watchlist: Updates when stocks added/removed

### **State Management**
- **AuthContext**: User authentication state
- **PortfolioContext**: Holdings data
- **WalletContext**: Balance and transactions
- **localStorage**: JWT token persistence

## 🛣️ Routes

| Path | Component | Protected |
|------|-----------|-----------|
| `/` | Redirect to `/login` | ❌ |
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/dashboard` | Dashboard | ✅ |
| `/popular` | PopularStocks | ✅ |
| `/watchlist` | Watchlist | ✅ |
| `/portfolio` | Portfolio | ✅ |
| `/wallet` | Wallet | ✅ |
| `/orders` | AllOrders | ✅ |
| `/search` | SearchStocks | ✅ |
| `/stock/:symbol` | StockDetails | ✅ |

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.11.0",
  "vite": "^4.3.0"
}
```

## 🎨 Styling

- **Inline Styles** with JavaScript objects
- **CSS-in-JS** using template literals
- **Responsive Design** with media queries
- **Gradients** for modern look
- **Animations** for smooth interactions

## 🔄 API Integration

All API calls use the `API_BASE_URL` from `src/api/api.js`:

```javascript
// Example API call
const token = localStorage.getItem("token");
const response = await fetch(`${API_BASE_URL}/endpoint`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
```

## 🧪 Testing

```bash
# Run development server
npm run start

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Performance Optimizations

- **Code Splitting** with React Router
- **Lazy Loading** for routes
- **Context API** for state management
- **useEffect** cleanup for subscriptions
- **Debounced Search** in stock search

## 🌈 Color Scheme

- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success**: Green gradient (#16a34a → #15803d)
- **Danger**: Red gradient (#ef4444 → #dc2626)
- **Info**: Blue gradient (#4facfe → #00f2fe)
- **Background**: White (#ffffff)
- **Text**: Dark slate (#1e293b)

## 🐛 Known Issues

- Search results don't close when clicking outside
- No loading states for all API calls
- No error boundary for component failures

## 🔮 Future Enhancements

- [ ] Add charts for stock prices
- [ ] Add notifications for order completion
- [ ] Add transaction history
- [ ] Add dark mode
- [ ] Add stock filters
- [ ] Add export portfolio as PDF
- [ ] Add email notifications
- [ ] Add 2FA authentication

## 📱 Mobile Features

- **Hamburger Menu** - Smooth slide-in navigation
- **Touch-Friendly** - 44px minimum tap targets
- **Swipe Gestures** - For mobile interactions
- **Bottom Sheets** - Buy/Sell forms slide up
- **Pull to Refresh** - For real-time updates

## 🏗️ Build & Deploy

### **Build for production**
```bash
npm run build
```

### **Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🔒 Security

- JWT tokens stored in localStorage
- Protected routes with authentication
- Input validation on forms
- XSS protection with React
- HTTPS recommended for production

---

**Built with ❤️ using React + Vite**