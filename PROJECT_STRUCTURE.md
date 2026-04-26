# VanguardCrux - Project Structure

## Directory Organization

```
vanguardcrux-local/
├── api/                          # Serverless API endpoints (Vercel)
│   └── vanguard-chat.js         # Grok API integration for chatbot
│
├── assets/                       # Project assets (organized by type)
│   ├── audio/                   # Background music and sound effects
│   ├── css/                     # Additional stylesheets
│   │   ├── animations-premium.css
│   │   ├── immersive-effects.css
│   │   ├── music-controls.css
│   │   └── world-journey.css
│   ├── icons/                   # UI icons and logos
│   │   └── robot.png            # VanguardIA chatbot icon
│   ├── images/                  # Images organized by project
│   │   ├── Fintech/
│   │   ├── Kultur/
│   │   ├── Roobi/
│   │   └── world-map-highres.svg
│   ├── js/                      # JavaScript modules
│   │   ├── advanced-animations.js
│   │   ├── background-music.js
│   │   ├── cursor-effects.js
│   │   ├── helix-team-360.js
│   │   ├── map-data.js
│   │   ├── particle-system.js
│   │   ├── vanguard-chat.js    # Chatbot client logic
│   │   └── world-journey.js
│   └── videos/                  # Team videos and team 360°
│       └── team/
│
├── scratch/                     # Development scratchpad (ignore)
│
├── .security/                   # Security configuration
│   └── sentinel-allowlist.json
│
├── .git/                        # Version control
│
├── .gitignore                   # Git ignore rules
│
├── .claude/                     # Claude Code configuration
│
├── index.html                   # Main landing page
│
├── styles.css                   # Global stylesheet (~2400 lines)
│
├── main.js                      # Main application logic
│
├── package.json                 # Dependencies (d3-geo, d3-geo-projection)
│
├── package-lock.json            # Dependency lockfile
│
├── vercel.json                  # Vercel deployment config
│
├── PROJECT_STRUCTURE.md         # This file
│
├── PLAN_MEJORAS_ES.md          # Improvement plan (Spanish)
│
├── countries.geo.json           # GeoJSON world map data
│
├── generated-world.svg          # Generated world map
│
└── Case Study Files             # Individual project pages
    ├── aiagent-case.html       # AI Agent Proof of Concept
    ├── aipoc-case.html         # AI PoC case study
    ├── case-fintech.html       # Fintech project
    ├── clawsuite-case.html     # ClawSuite project
    ├── cruxanalytics-case.html # CruxAnalytics project
    ├── edtech-case.html        # EdTech ecosystem project
    ├── fintech-case.html       # Fintech case study
    ├── kultur-atelier.html     # Kultur Atelier project
    └── selfhealing-case.html   # Self-healing systems project
    └── *-es.html, *-pt.html    # Spanish and Portuguese versions
```

## Key Features

### VanguardIA Chatbot
- **Location**: Top-right corner of page
- **Icon**: `assets/icons/robot.png`
- **Frontend**: `assets/js/vanguard-chat.js`
- **Backend**: `api/vanguard-chat.js`
- **Languages**: Spanish (es), Portuguese (pt), English (en)
- **Sales Funnel Stages**:
  1. Greeting - Ask about business
  2. Qualification - Confirm entrepreneur status
  3. Pain Points - Identify challenges
  4. Solution - Explain how VanguardCrux helps
  5. CTA - Offer free analysis via Calendly

### Map System
- **World Map**: `generated-world.svg`
- **GeoJSON Data**: `countries.geo.json`
- **Journey Visualization**: `assets/js/world-journey.js`
- **Styling**: `assets/css/world-journey.css`

### Case Studies
- **10 Real Projects** (with Spanish/Portuguese versions)
- **Responsive Design**: Desktop, tablet, mobile
- **Standardized Cards**: Consistent styling across all projects

## Configuration

### Environment Variables (Vercel)
Set these in your Vercel project settings:
```
GROK_API_KEY = <your-grok-api-key>
```

### Deployment
- **Platform**: Vercel
- **Static Files**: Root folder
- **API Routes**: `/api/*` automatically served as serverless functions
- **Trigger**: Auto-deploy on push to main branch

## Development

### Local Testing
1. Open `index.html` in browser
2. JavaScript modules load automatically
3. API calls will fail locally without Grok API key configured

### Adding New Features
1. **CSS**: Add to `styles.css` or create module in `assets/css/`
2. **JavaScript**: Create module in `assets/js/`
3. **Images**: Organize in `assets/images/<project-name>/`
4. **API Endpoints**: Create in `api/<endpoint-name>.js`

## Security
- API keys stored in Vercel environment variables (never in code)
- `.security/sentinel-allowlist.json` authorizes safe patterns
- No sensitive data in version control

## Performance Notes
- **Large Assets**: Use WebP for images, MP4/WebM for videos
- **GeoJSON**: Country geometry file is ~250KB (pre-compressed)
- **CSS**: Organized into modules for maintainability
- **JavaScript**: Modular system with event listeners

## Support
For issues or questions about the project structure, refer to the relevant section or file documentation.
