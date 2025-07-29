import type { MapScreenshotOptions } from './schemas'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import defu from 'defu'
import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function withDefaults(options: MapScreenshotOptions): Required<MapScreenshotOptions> {
  return defu(options, {
    zoom: 14,
    markers: [],
    isRounded: false,
    width: 800,
    height: 800,
  } satisfies Omit<Required<MapScreenshotOptions>, 'center'>)
}

// Function overloads for proper typing
export async function takeMapScreenshot(options: MapScreenshotOptions): Promise<Uint8Array>
export async function takeMapScreenshot(options: MapScreenshotOptions[]): Promise<Uint8Array[]>
export async function takeMapScreenshot(
  options: MapScreenshotOptions | MapScreenshotOptions[],
): Promise<Uint8Array | Uint8Array[]> {
  // Convert single option to array for uniform processing
  const optionsArray = Array.isArray(options) ? options : [options]
  const results = await takeMultipleScreenshots(optionsArray)

  // Return single result if input was single option, otherwise return array
  return Array.isArray(options) ? results : results[0]!
}

async function takeMultipleScreenshots(
  optionsArray: MapScreenshotOptions[],
): Promise<Uint8Array[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  const results: Uint8Array[] = []

  // Load the HTML content once
  const htmlFilePath = join(__dirname, './map/builtMap/index.html')
  const htmlContent = readFileSync(htmlFilePath, 'utf-8')
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

  // Process each screenshot sequentially with proper awaiting
  for (const options of optionsArray) {
    const completeOptions = withDefaults(options)

    await page.setViewport({ width: completeOptions.width, height: completeOptions.height, deviceScaleFactor: 1 })

    // Configure the map with current options
    await page.evaluate((completeOptions) => {
      window.dispatchEvent(new CustomEvent('map-configure', {
        detail: { options: completeOptions },
      }))
    }, completeOptions)

    // Wait for map to be ready and tiles to load
    await page.waitForNetworkIdle({ idleTime: 250 })

    // Take screenshot and get bytes
    const screenshotBuffer = await page.screenshot({
      omitBackground: true,
      type: 'png',
    })

    results.push(screenshotBuffer)
  }

  await browser.close()

  return results
}

export type {
  MapScreenshotOptions,
  MarkerConfig,
} from './schemas'
