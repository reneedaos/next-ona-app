# Next ONA Demo - Futuristic Network Analysis

A cutting-edge Next.js application for Organizational Network Analysis with futuristic design and enhanced 3D visualizations.

## 🚀 Features

### 🌟 Futuristic UI/UX
- **Cyberpunk Design**: Neon glows, glass morphism, and animated grid backgrounds
- **Matrix-style Effects**: Animated rain effects and scanning animations
- **Responsive Layout**: Optimized for all screen sizes
- **Interactive Elements**: Hover effects, transitions, and micro-animations

### 🔮 Enhanced Network Visualizations
- **Interactive D3.js Networks**: Click, drag, zoom, and explore
- **3D Node Relationships**: Depth and perspective in network topology
- **Real-time Analytics**: Live metrics and engagement tracking
- **Advanced Filtering**: Multi-dimensional data exploration

### 🛠️ Technical Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom themes
- **Framer Motion**: Smooth animations and transitions
- **D3.js**: Advanced data visualization
- **Three.js**: 3D graphics and immersive experiences

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/reneedaos/next-ona-app.git
cd next-ona-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Palette
- **Neon Blue**: `#00f3ff` - Primary accent
- **Neon Purple**: `#bf00ff` - Secondary accent  
- **Neon Green**: `#39ff14` - Success/Active states
- **Cyber Dark**: `#0a0a0f` - Background
- **Cyber Gray**: `#1a1a24` - Cards/Panels

### Typography
- **Primary Font**: Orbitron (Futuristic)
- **Monospace**: Courier New (Matrix-style)
- **Body Text**: Inter (Clean, readable)

### Animations
- **Pulse Glow**: Breathing light effects
- **Float**: Subtle hover animations
- **Matrix Rain**: Background code rain
- **Grid Move**: Animated background grid

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with cyber theme
│   ├── page.tsx           # Main dashboard page
│   ├── simulation/        # ERGM simulation page
│   └── globals.css        # Global styles and animations
├── components/            # React components
│   ├── NetworkVisualization.tsx     # D3.js network graph
│   ├── ThreeNetworkVisualization.tsx # Three.js 3D network
│   ├── Dashboard.tsx      # Main analytics dashboard
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── MatrixRain.tsx     # Background effects
├── lib/                   # Utility functions
│   ├── ergm-simulation.ts # ERGM simulation engine
│   └── analytics-data.ts  # Data generation
├── types/                 # TypeScript definitions
└── data/                  # Sample data and generators
```

## 🎯 Features Roadmap

### Phase 1: Core Visualization ✅
- [x] Interactive network graph with D3.js
- [x] Node selection and analysis
- [x] Drag and zoom functionality
- [x] Department-based color coding

### Phase 2: Enhanced Analytics ✅
- [x] Real-time metrics dashboard
- [x] Predictive analytics for attrition risk
- [x] Employee engagement prediction models
- [x] Job performance forecasting
- [x] Department analytics and drill-downs
- [x] Career path predictions
- [x] Skills gap analysis
- [x] Workforce needs prediction

### Phase 3: 3D Experience ✅
- [x] Three.js 3D network visualizations
- [x] Exponential Random Graph Modeling (ERGM) simulation
- [x] Interactive 3D network with orbital controls
- [x] Real-time network evolution animation
- [x] Physics-based force-directed layout
- [x] Advanced simulation parameters (homophily, clustering, preferential attachment)
- [x] Live statistics tracking and visualization
- [x] Time-based network dynamics with edge aging
- [x] Department-based color coding in 3D space
- [x] Configurable simulation speed and controls


### Phase 4: AI Integration 📋
- [ ] Predictive analytics
- [ ] Anomaly detection
- [ ] Natural language querying
- [ ] Smart recommendations

## 🎮 Interactive Controls

### Network Visualization (2D)
- **Click**: Select node for detailed analysis
- **Drag**: Move nodes to reorganize layout
- **Scroll**: Zoom in/out of network
- **Hover**: Preview node information

### 3D Network Simulation
- **Mouse**: Orbit around the network
- **Scroll**: Zoom in/out of 3D space
- **Click**: Select nodes for analysis
- **Controls Panel**: Adjust simulation parameters in real-time
- **Start/Pause**: Control simulation execution
- **Reset**: Restart simulation with new parameters
- **Speed Control**: Adjust simulation speed (0.1x to 3x)

### Dashboard Navigation
- **Sidebar**: Switch between different views
- **Tabs**: Access various analytics modules
- **Filters**: Customize data display

## 🔧 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Environment Setup
1. Node.js 18+ required
2. Install dependencies with `npm install`
3. Configure environment variables if needed

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t next-ona-demo .
docker run -p 3000:3000 next-ona-demo
```

### Static Export
```bash
npm run build
npm run export
```

## 🤝 Contributing

1. Fork the repository from https://github.com/reneedaos/next-ona-app.git
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

---

**Built with ⚡ by the future**