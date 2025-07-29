import * as v from 'valibot'

// Base coordinate schema for latitude and longitude
const CoordinateSchema = v.pipe(
  v.string('Coordinate must be a string'),
  v.transform(Number.parseFloat),
  v.number('Coordinate must be a valid number'),
  v.minValue(-180, 'Coordinate must be >= -180'),
  v.maxValue(180, 'Coordinate must be <= 180'),
)

// Latitude schema (restricted to -90 to 90)
export const LatitudeSchema = v.pipe(
  CoordinateSchema,
  v.minValue(-90, 'Latitude must be >= -90'),
  v.maxValue(90, 'Latitude must be <= 90'),
)

// Longitude schema (restricted to -180 to 180)
export const LongitudeSchema = v.pipe(
  CoordinateSchema,
  v.minValue(-180, 'Longitude must be >= -180'),
  v.maxValue(180, 'Longitude must be <= 180'),
)

// Zoom level schema (1-18 for map zoom levels)
export const ZoomSchema = v.pipe(
  v.string('Zoom level must be a string'),
  v.transform(Number.parseInt),
  v.number('Zoom level must be a valid number'),
  v.minValue(1, 'Zoom level must be at least 1'),
  v.maxValue(18, 'Zoom level must be at most 18 (maximum map zoom)'),
  v.integer('Zoom level must be an integer'),
  v.metadata({
    title: 'Map Zoom Level',
    description: 'The zoom level of the map (1-18). Higher values zoom in closer to the map.',
    examples: [10, 14, 16],
  }),
)

// Dimension schema for width and height (1-10000 pixels)
export const DimensionSchema = v.pipe(
  v.string('Dimension must be a string'),
  v.transform(Number.parseInt),
  v.number('Dimension must be a valid number'),
  v.minValue(1, 'Dimension must be at least 1 pixel'),
  v.maxValue(10000, 'Dimension must be at most 10000 pixels'),
  v.integer('Dimension must be an integer'),
  v.metadata({
    title: 'Image Dimension',
    description: 'The width or height of the generated image in pixels.',
    examples: [400, 800, 1200, 1920],
  }),
)

// File path schema for output files
export const FilePathSchema = v.pipe(
  v.string('File path must be a string'),
  v.minLength(1, 'File path cannot be empty'),
  v.metadata({
    title: 'File Path',
    description: 'A file path for saving the output image. Can be relative or absolute.',
    examples: ['map-screenshot.png', './output/map.png', '/home/user/map.jpg'],
  }),
)

// Boolean schema that can handle string input
export const BooleanSchema = v.pipe(
  v.union([v.boolean(), v.string()], 'Value must be a boolean or string'),
  v.transform((value) => {
    if (typeof value === 'boolean')
      return value
    return value.toLowerCase() === 'true' || value === '1'
  }),
  v.metadata({
    title: 'Boolean Value',
    description: 'A boolean value that can be provided as true/false or as string "true"/"false"/"1"/"0".',
    examples: [true, false, 'true', 'false', '1', '0'],
  }),
)

// Center coordinate schema for lat,lng pair
export const CenterSchema = v.pipe(
  v.string('Center coordinates must be a string'),
  v.transform((str) => {
    try {
      const coords = JSON.parse(str)
      if (!Array.isArray(coords) || coords.length !== 2) {
        throw new Error('Center must be an array of [latitude, longitude]')
      }
      return coords
    }
    catch {
      // Try parsing as comma-separated values
      const parts = str.split(',').map(part => part.trim())
      if (parts.length !== 2) {
        throw new Error('Center must be in format "[lat, lng]" or "lat,lng"')
      }
      return parts.map(Number.parseFloat)
    }
  }),
  v.tuple([v.number('Latitude must be a number'), v.number('Longitude must be a number')]),
  v.check((coords) => {
    const [lat] = coords
    return lat >= -90 && lat <= 90
  }, 'Latitude must be between -90 and 90'),
  v.check((coords) => {
    const [, lng] = coords
    return lng >= -180 && lng <= 180
  }, 'Longitude must be between -180 and 180'),
  v.metadata({
    title: 'Map Center Coordinates',
    description: 'The center coordinates of the map as [latitude, longitude]. Can be provided as JSON array or comma-separated values.',
    examples: ['[37.7749, -122.4194]', '40.7128,-74.0060', '[51.5074, -0.1278]'],
  }),
)

// Raw number schemas for MapScreenshotOptions (without string transformation)
const LatitudeNumberSchema = v.pipe(
  v.number('Latitude must be a number'),
  v.minValue(-90, 'Latitude must be >= -90'),
  v.maxValue(90, 'Latitude must be <= 90'),
  v.metadata({
    title: 'Latitude',
    description: 'Latitude coordinate in decimal degrees.',
    examples: [37.7749, 40.7128, 51.5074, -33.8688],
  }),
)

const LongitudeNumberSchema = v.pipe(
  v.number('Longitude must be a number'),
  v.minValue(-180, 'Longitude must be >= -180'),
  v.maxValue(180, 'Longitude must be <= 180'),
  v.metadata({
    title: 'Longitude',
    description: 'Longitude coordinate in decimal degrees.',
    examples: [-122.4194, -74.0060, -0.1278, 151.2093],
  }),
)

const ZoomNumberSchema = v.pipe(
  v.number('Zoom level must be a number'),
  v.minValue(1, 'Zoom level must be at least 1'),
  v.maxValue(18, 'Zoom level must be at most 18 (maximum map zoom)'),
  v.integer('Zoom level must be an integer'),
  v.metadata({
    title: 'Map Zoom Level',
    description: 'The zoom level of the map (1-18). Higher values zoom in closer to the map.',
    examples: [10, 14, 16],
  }),
)

const DimensionNumberSchema = v.pipe(
  v.number('Dimension must be a number'),
  v.minValue(1, 'Dimension must be at least 1 pixel'),
  v.maxValue(10000, 'Dimension must be at most 10000 pixels'),
  v.integer('Dimension must be an integer'),
  v.metadata({
    title: 'Image Dimension',
    description: 'The width or height of the generated image in pixels.',
    examples: [400, 800, 1200, 1920],
  }),
)

// Marker configuration schema that matches the interface exactly
export const MarkerConfigSchema = v.pipe(
  v.object({
    position: v.pipe(
      v.tuple([LatitudeNumberSchema, LongitudeNumberSchema]),
      v.metadata({
        title: 'Marker Position',
        description: 'The position of the marker on the map as [latitude, longitude].',
        examples: [[37.7749, -122.4194], [40.7128, -74.0060], [51.5074, -0.1278]],
      }),
    ),
    popupText: v.optional(v.pipe(
      v.string('Popup text must be a string'),
      v.metadata({
        title: 'Marker Popup Text',
        description: 'Optional text to display in a popup when the marker is clicked.',
        examples: ['San Francisco', 'New York City', 'Important Location', 'Meeting Point'],
      }),
    )),
  }, 'Marker configuration must be an object with position and optional popupText'),
  v.metadata({
    title: 'Map Marker',
    description: 'A marker to display on the map with a position and optional popup text.',
    examples: [
      { position: [37.7749, -122.4194], popupText: 'San Francisco' },
      { position: [40.7128, -74.0060] },
      { position: [51.5074, -0.1278], popupText: 'London' },
    ],
  }),
)

// Array of markers schema with JSON parsing
export const MarkersSchema = v.pipe(
  v.string('Markers must be a JSON string'),
  v.transform((str) => {
    try {
      return JSON.parse(str)
    }
    catch {
      throw new Error('Invalid JSON format for markers. Expected: [{"position": [lat, lng], "popupText": "text"}, ...]')
    }
  }),
  v.array(MarkerConfigSchema, 'Markers must be an array'),
  v.transform(markers =>
    markers.map((marker) => {
      // Ensure the result matches MarkerConfig interface exactly
      if (marker.popupText === undefined) {
        return { position: marker.position }
      }
      return { position: marker.position, popupText: marker.popupText }
    }),
  ),
  v.metadata({
    title: 'Map Markers',
    description: 'An array of markers to display on the map, provided as a JSON string.',
    examples: [
      '[{"position": [37.7749, -122.4194], "popupText": "San Francisco"}]',
      '[{"position": [40.7128, -74.0060]}, {"position": [51.5074, -0.1278], "popupText": "London"}]',
      '[]',
    ],
  }),
)

// Complete CLI arguments schema with proper descriptions
export const CLIArgsSchema = v.pipe(
  v.object({
    // The center coordinates of the map as [latitude, longitude]. Can be provided as JSON array "[37.7749, -122.4194]" or comma-separated "37.7749,-122.4194"
    center: CenterSchema,
    // The zoom level of the map (1-18). Higher values zoom in closer. Default: 14
    zoom: v.optional(ZoomSchema),
    // The width of the generated image in pixels (1-10000). Default: 800
    width: v.optional(DimensionSchema),
    // The height of the generated image in pixels (1-10000). Default: 800
    height: v.optional(DimensionSchema),
    // Whether to round the corners of the map container. Default: false
    rounded: v.optional(BooleanSchema),
    // Markers to display on the map as JSON array. Format: [{"position": [lat, lng], "popupText": "optional text"}]
    markers: v.optional(MarkersSchema),
    // Output file path to save the screenshot. Can be relative or absolute. Default: map-screenshot.png
    output: v.optional(FilePathSchema),
    // Image/Video file to extract location from (not yet implemented)
    file: v.optional(v.pipe(
      v.string('File path must be a string'),
      v.metadata({
        title: 'Input File',
        description: 'Path to an image or video file to extract location from (not yet implemented).',
        examples: ['./photo.jpg', '/path/to/video.mp4', 'image.png'],
      }),
    )),
  }, 'CLI arguments for generating map screenshots'),
  v.metadata({
    title: 'MapShot CLI Arguments',
    description: 'Command-line arguments for generating map screenshots with optional markers.',
    examples: [
      {
        center: '[37.7749, -122.4194]',
        zoom: '14',
        output: 'san-francisco-map.png',
      },
      {
        center: '40.7128,-74.0060',
        zoom: '12',
        width: '1200',
        height: '800',
        markers: '[{"position": [40.7128, -74.0060], "popupText": "NYC"}]',
        rounded: true,
      },
    ],
  }),
)

// Map screenshot options schema that matches the interface exactly
export const MapScreenshotOptionsSchema = v.pipe(
  v.object({
    // The center coordinates of the map as [latitude, longitude]
    center: v.pipe(
      v.tuple([LatitudeNumberSchema, LongitudeNumberSchema]),
      v.metadata({
        title: 'Map Center Coordinates',
        description: 'The center coordinates of the map as [latitude, longitude].',
        examples: [[37.7749, -122.4194], [40.7128, -74.0060], [51.5074, -0.1278]],
      }),
    ),
    // The zoom level of the map (1-18). Higher values zoom in closer. Default: 14
    zoom: v.optional(ZoomNumberSchema),
    // The width of the generated image in pixels (1-10000). Default: 800
    width: v.optional(DimensionNumberSchema),
    // The height of the generated image in pixels (1-10000). Default: 800
    height: v.optional(DimensionNumberSchema),
    // Whether to round the corners of the map container. Default: false
    isRounded: v.optional(v.pipe(
      v.boolean('isRounded must be a boolean'),
      v.metadata({
        title: 'Rounded Corners',
        description: 'Whether to round the corners of the map container.',
        examples: [true, false],
      }),
    )),
    // Array of markers to display on the map. Each marker has a position and optional popup text
    markers: v.optional(v.pipe(
      v.array(MarkerConfigSchema, 'Markers must be an array'),
      v.metadata({
        title: 'Map Markers Array',
        description: 'Array of markers to display on the map. Each marker has a position and optional popup text.',
        examples: [
          [],
          [{ position: [37.7749, -122.4194], popupText: 'San Francisco' }],
          [
            { position: [40.7128, -74.0060] },
            { position: [51.5074, -0.1278], popupText: 'London' },
          ],
        ],
      }),
    )),
  }, 'Options for generating map screenshots'),
  v.metadata({
    title: 'Map Screenshot Options',
    description: 'Configuration options for generating map screenshots with optional markers and styling.',
    examples: [
      {
        center: [37.7749, -122.4194],
        zoom: 14,
      },
      {
        center: [40.7128, -74.0060],
        zoom: 12,
        width: 1200,
        height: 800,
        isRounded: true,
        markers: [{ position: [40.7128, -74.0060], popupText: 'NYC' }],
      },
    ],
  }),
)

// AI Tool schema that includes both screenshot options and output path
export const MapScreenshotToolSchema = v.pipe(
  v.object({
    // Map screenshot configuration options
    options: MapScreenshotOptionsSchema,
    // Output file path where the screenshot should be saved
    outputPath: v.pipe(
      FilePathSchema,
      v.metadata({
        title: 'Output File Path',
        description: 'The file path where the generated map screenshot should be saved. Can be relative or absolute.',
        examples: ['map-screenshot.png', './output/maps/location.png', '/home/user/screenshots/map.jpg'],
      }),
    ),
  }, 'Complete configuration for generating and saving a map screenshot'),
  v.metadata({
    title: 'Map Screenshot Generation Tool',
    description: 'AI tool for generating map screenshots with specified options and saving to a file path.',
    examples: [
      {
        options: {
          center: [37.7749, -122.4194],
          zoom: 14,
        },
        outputPath: 'san-francisco-map.png',
      },
      {
        options: {
          center: [40.7128, -74.0060],
          zoom: 12,
          width: 1200,
          height: 800,
          isRounded: true,
          markers: [{ position: [40.7128, -74.0060], popupText: 'NYC' }],
        },
        outputPath: './output/nyc-map.png',
      },
    ],
  }),
)

// Type exports for TypeScript - use schema-derived types
export type CLIArgs = v.InferOutput<typeof CLIArgsSchema>
export type MapScreenshotOptions = v.InferOutput<typeof MapScreenshotOptionsSchema>
export type MarkerConfig = v.InferOutput<typeof MarkerConfigSchema>
