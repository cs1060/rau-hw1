## HW1 Explanation

I made a map that allows you to explore Wikipedia landmarks on an interactive map using Leaflet.js. I worked by myself. It took around 2 hours. Only issues I encountered were Leaflet styling but not really.

# Wikipedia Map Explorer

A Next.js application that lets you explore Wikipedia landmarks on an interactive map using Leaflet.js.

## Core Features

-   Interactive map with satellite and street view layers
-   Search for cities to jump to locations
-   Filter landmarks by type (cities, mountains, landmarks etc)
-   Click landmarks to view Wikipedia extracts
-   Automatic location detection
-   Custom emoji markers for different landmark types

## Project Structure

### Frontend Components

#### Map Component (`/app/components/Map.tsx`)

The main map component that handles:

-   Map initialization and tile layers
-   Landmark markers and popups
-   Location tracking
-   Type filtering
-   Custom emoji markers for different landmark types

#### Home Page (`/app/page.tsx`)

-   City search functionality
-   Dynamic map loading
-   Error handling

### API Routes

#### Location API (`/api/location/route.ts`)

-   Geocoding city names to coordinates using OpenStreetMap Nominatim API
-   Error handling for invalid cities

#### Nearby API (`/api/nearby/route.ts`)

-   Fetches nearby Wikipedia landmarks using MediaWiki API
-   Filters landmarks by type
-   Enriches landmarks with Wikipedia article details
-   Handles popup content generation

## Testing

The project uses Jest and React Testing Library for component testing.

### Test Setup

-   `jest.config.js` - Jest configuration with Next.js integration
-   `jest.setup.js` - Testing library setup and custom matchers

### Component Tests (`/__tests__/Map.test.tsx`)

Tests cover:

-   Map component rendering
-   Wiki type selection changes
-   Search center prop handling
-   Leaflet integration mocking

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch
```

## Development

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Environment Setup

The project requires:

-   Node.js 16+
-   npm/yarn
-   Modern browser with geolocation support

## Technical Details

### Key Dependencies

-   Next.js 14+ - React framework
-   Leaflet.js - Map library
-   Tailwind CSS - Styling
-   Jest/React Testing Library - Testing
-   Axios - API requests

### State Management

-   React hooks for local state
-   URL parameters for shareable locations
-   Refs for map instance management

### API Integration

-   Wikipedia MediaWiki API for landmark data
-   OpenStreetMap Nominatim API for geocoding
-   Custom rate limiting and caching

### Performance Optimizations

-   Dynamic imports for map component
-   Debounced search updates
-   Marker clustering for dense areas
-   Lazy loading of Wikipedia content

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - feel free to use and modify for your own projects.
