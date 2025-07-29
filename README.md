# 🗺️ MapShot

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

A modern, type-safe TypeScript library for generating high-quality map screenshots with markers, custom zoom levels, and flexible positioning. Perfect for creating map images programmatically with both CLI and MCP server support.

## ✨ Features

- **🗺️ High-Quality Maps**: Generate crisp map screenshots at any resolution
- **🔧 Flexible Configuration**: Control zoom levels, dimensions, and map center
- **🖥️ CLI Interface**: Easy-to-use command-line tool for quick map generation
- **🤖 MCP Server**: Model Context Protocol server for AI assistant integration
- **🔒 Type-Safe**: Full TypeScript support with compile-time type checking

## 🏆 Advantages

### Programmatic Map Generation
Unlike manual screenshot tools, MapShot provides **programmatic control** over map generation with precise positioning and customization options.

### Multiple Interfaces
- **CLI**: Perfect for scripts and automation
- **MCP Server**: Seamless integration with AI assistants
- **Programmatic API**: Use directly in your TypeScript/JavaScript projects

## 📦 Installation

```bash
# npm
npm install -g mapshot

# yarn
yarn global add mapshot

# pnpm
pnpm add -g mapshot
```

## 🚀 Usage

### CLI Interface

#### Basic Map Screenshot
```bash
# Generate a map of London with default settings
mapshot snap --center 51.5074,-0.1278 --output london.png

# Alternative: using JSON array format for coordinates
mapshot snap --center "[51.5074, -0.1278]" --output london.png
```

#### Map with Markers
```bash
# Create a map with multiple markers
mapshot snap \
  --center 51.5007,-0.1246 \
  --zoom 14 \
  --width 1920 \
  --height 1080 \
  --markers '[{"position": [51.4994, -0.1245], "popupText": "Big Ben"}, {"position": [51.5033, -0.1195], "popupText": "London Eye"}]' \
  --output thames-landmarks.png
```

#### High-Resolution Maps
```bash
# Generate a 4K map screenshot
mapshot snap \
  --center 35.6762,139.6503 \
  --zoom 12 \
  --width 3840 \
  --height 2160 \
  --markers '[{"position": [35.6762, 139.6503], "popupText": "Tokyo"}]' \
  --output tokyo-4k.png
```

### MCP Server

Start the MCP server for AI assistant integration:

```bash
mapshot mcp
```

The MCP server provides AI assistants with the ability to generate map screenshots programmatically.

### Programmatic API

#### Basic Usage
```typescript
import { writeFileSync } from 'node:fs'
import { takeMapScreenshot } from 'mapshot'

// Generate a simple map screenshot
const screenshot = await takeMapScreenshot({
  center: [51.5074, -0.1278], // London coordinates
  zoom: 12,
  width: 800,
  height: 600
})

// Save to file
writeFileSync('london.png', screenshot)
```

#### Map with Markers
```typescript
import { takeMapScreenshot } from 'mapshot'

const screenshot = await takeMapScreenshot({
  center: [51.5007, -0.1246],
  zoom: 14,
  width: 1200,
  height: 800,
  markers: [
    {
      position: [51.4994, -0.1245],
      popupText: 'Big Ben'
    },
    {
      position: [51.5033, -0.1195],
      popupText: 'London Eye'
    }
  ]
})
```

#### Multiple Screenshots
```typescript
// Generate multiple screenshots in one call
const screenshots = await takeMapScreenshot([
  {
    center: [51.5074, -0.1278],
    zoom: 12,
    markers: [{ position: [51.5074, -0.1278], popupText: 'London' }]
  },
  {
    center: [35.6762, 139.6503],
    zoom: 12,
    markers: [{ position: [35.6762, 139.6503], popupText: 'Tokyo' }]
  }
])

// screenshots is now an array of Uint8Array buffers
```

### CLI Format Requirements

When using the CLI, note the following format requirements:

- **Center coordinates**: Can be provided as comma-separated `"lat,lng"` or JSON array `"[lat, lng]"`
- **Markers**: Must be provided as a JSON array string with proper escaping:
  ```bash
  --markers '[{"position": [lat, lng], "popupText": "optional text"}]'
  ```

### Configuration Options

#### MapScreenshotOptions
```typescript
interface MapScreenshotOptions {
  center: [number, number] // [latitude, longitude]
  zoom?: number // Map zoom level (default: 14)
  width?: number // Image width in pixels (default: 800)
  height?: number // Image height in pixels (default: 800)
  markers?: MarkerConfig[] // Array of markers to display
  isRounded?: boolean // Apply rounded corners (default: false)
}

interface MarkerConfig {
  position: [number, number] // [latitude, longitude]
  popupText: string // Text to display in marker popup
}
```

## 🎯 Use Cases

### Documentation and Reporting
Generate consistent map images for documentation, reports, or presentations:

```typescript
// Generate maps for multiple office locations
const officeLocations = [
  { name: 'London Office', coords: [51.5074, -0.1278] },
  { name: 'Tokyo Office', coords: [35.6762, 139.6503] },
  { name: 'New York Office', coords: [40.7128, -74.0060] }
]

const maps = await takeMapScreenshot(
  officeLocations.map(office => ({
    center: office.coords,
    zoom: 15,
    width: 600,
    height: 400,
    markers: [{
      position: office.coords,
      popupText: office.name
    }]
  }))
)
```

### AI Assistant Integration
Use with AI assistants through the MCP server to generate location-based visual content automatically.

### Automated Workflows
Integrate into CI/CD pipelines or automated reporting systems for dynamic map generation.

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run linting
pnpm lint

# Start development map viewer
pnpm dev:map
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](./LICENSE) file for details.

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/mapshot?style=flat&colorA=18181B&colorB=28A745
[npm-version-href]: https://npmjs.com/package/mapshot
[npm-downloads-src]: https://img.shields.io/npm/dm/mapshot?style=flat&colorA=18181B&colorB=28A745
[npm-downloads-href]: https://npmjs.com/package/mapshot
[bundle-src]: https://img.shields.io/bundlephobia/minzip/mapshot?style=flat&colorA=18181B&colorB=28A745
[bundle-href]: https://bundlephobia.com/result?p=mapshot
[license-src]: https://img.shields.io/github/license/schplitt/mapshot.svg?style=flat&colorA=18181B&colorB=28A745
[license-href]: https://github.com/schplitt/mapshot/blob/main/LICENSE
