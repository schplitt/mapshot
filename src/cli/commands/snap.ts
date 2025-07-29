import process from 'node:process'
import { defineCommand } from 'citty'
import consola from 'consola'
import * as v from 'valibot'
import { takeMapScreenshot } from '../../index'
import { CLIArgsSchema } from '../../schemas'
import { writeScreenshotFile } from '../../utils'

export default defineCommand({
  meta: {
    name: 'snap',
    description: 'Generate map screenshots with markers',
  },
  args: {
    center: {
      description: 'Latitude and Longitude of the location.',
      valueHint: '[lat, lng]',
      type: 'string',
      required: true,
      alias: 'c',
    },
    file: {
      description: 'Path to image/video to try to read the location from (not yet implemented)',
      type: 'string',
    },
    output: {
      description: 'Output file to save the result. Can be relative or absolute path',
      type: 'string',
      default: 'map-screenshot.png',
      alias: 'o',
    },
    zoom: {
      description: 'Zoom level for the map',
      type: 'string',
      default: '14',
      alias: 'z',
    },
    width: {
      description: 'Width of the image',
      type: 'string',
      default: '800',
      alias: 'w',
    },
    height: {
      description: 'Height of the image',
      type: 'string',
      default: '800',
      alias: 'h',
    },
    rounded: {
      description: 'Whether to round the corners of the map container',
      type: 'boolean',
      default: false,
    },
    markers: {
      description: 'Markers to add to the map in JSON format',
      valueHint: '[{"position": [lat, lng], "popupText": "text"}, ...]',
      type: 'string',
      alias: 'm',
    },
  },
  run: async ({ args }) => {
    // Skip file processing for now as requested
    if (args.file) {
      consola.warn('File processing not yet implemented, ignoring --file argument')
    }

    try {
      consola.info('Generating map screenshot...')

      // Validate and parse all arguments
      const parsedArgs = v.parse(CLIArgsSchema, args)

      // Generate screenshot
      const bytes = await takeMapScreenshot(parsedArgs)

      // Write the screenshot to the output file using the utility function
      // This handles both relative and absolute paths correctly
      const outputPath = parsedArgs.output ?? 'map-screenshot.png'
      const writtenPath = writeScreenshotFile(bytes, outputPath)

      consola.success(`Screenshot saved to: ${writtenPath}`)
    }
    catch (error) {
      consola.error('Error:', error instanceof Error ? error.message : String(error))
      process.exit(1)
    }
  },
})
