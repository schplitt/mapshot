import { writeFileSync } from 'node:fs'
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot'
import { StdioTransport } from '@tmcp/transport-stdio'
import { defineCommand } from 'citty'
import { McpServer } from 'tmcp'
import packageJson from '../../../package.json'
import { takeMapScreenshot } from '../../index'
import { MapScreenshotToolSchema } from '../../schemas'

export default defineCommand({
  meta: {
    name: 'mcp',
    description: 'Start MapShot MCP server for AI assistants (stdio transport only)',
  },
  async run() {
    const adapter = new ValibotJsonSchemaAdapter()
    const server = new McpServer(
      {
        name: 'mapshot-mcp-server',
        version: packageJson.version,
        description: 'MapShot MCP server for generating map screenshots with AI assistants',
      },
      {
        adapter,
        capabilities: {
          tools: { listChanged: true },
          prompts: { listChanged: false },
          resources: { listChanged: false },
        },
      },
    )

    // Register the map screenshot generation tool
    server.tool(
      {
        name: 'generate-map-screenshot',
        description: 'Generate a screenshot of a map with specified coordinates, zoom level, and optional markers. Perfect for creating visual representations of locations, routes, or points of interest.',
        schema: MapScreenshotToolSchema,
      },
      async ({ options, outputPath }) => {
        try {
          // Generate the screenshot
          const screenshotBuffer = await takeMapScreenshot(options)

          // Save the screenshot to the specified path
          writeFileSync(outputPath, screenshotBuffer)

          return {
            content: [
              {
                type: 'text',
                text: `Successfully generated map screenshot and saved to: ${outputPath}
                
Map Details:
- Center: [${options.center[0]}, ${options.center[1]}]
- Zoom Level: ${options.zoom || 14}
- Dimensions: ${options.width || 800}x${options.height || 800}
- Rounded Corners: ${options.isRounded || false}
- Markers: ${options.markers?.length || 0} marker(s)`,
              },
            ],
            isError: false,
          }
        }
        catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to generate map screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          }
        }
      },
    )

    // Start stdio transport
    const transport = new StdioTransport(server)
    transport.listen()
  },
})
