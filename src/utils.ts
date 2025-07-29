import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

export interface FileOutput {
  /** The file path (relative or absolute) */
  path: string
  /** The file content as bytes */
  content: Uint8Array
  /** Optional description for logging */
  description?: string
}

/**
 * Writes one or more files to disk, creating directories as needed.
 * Handles both relative and absolute paths correctly.
 *
 * @param files - Array of files to write, or a single file
 * @param options - Writing options
 * @param options.baseDir - Base directory for relative paths. Defaults to process.cwd()
 * @param options.createDirs - Whether to create directories if they don't exist
 * @param options.verbose - Whether to log the file writes
 * @returns Array of absolute paths where files were written
 */
export function writeFilesToDisk(
  files: FileOutput | FileOutput[],
  options: {
    /** Base directory for relative paths. Defaults to process.cwd() */
    baseDir?: string
    /** Whether to create directories if they don't exist */
    createDirs?: boolean
    /** Whether to log the file writes */
    verbose?: boolean
  } = {},
): string[] {
  const {
    baseDir = process.cwd(),
    createDirs = true,
  } = options

  // Normalize to array
  const fileArray = Array.isArray(files) ? files : [files]
  const writtenPaths: string[] = []

  for (const file of fileArray) {
    // Resolve the path - if it's absolute, resolve returns it as-is
    // If it's relative, it's resolved relative to baseDir
    const absolutePath = resolve(baseDir, file.path)

    // Create directory if needed
    if (createDirs) {
      const dir = dirname(absolutePath)
      try {
        mkdirSync(dir, { recursive: true })
      }
      catch (error) {
        // Directory might already exist, ignore EEXIST errors
        if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
          throw error
        }
      }
    }

    // Write the file
    writeFileSync(absolutePath, file.content)
    writtenPaths.push(absolutePath)
  }

  return writtenPaths
}

/**
 * Helper function specifically for writing a single screenshot file
 *
 * @param content - The screenshot bytes
 * @param outputPath - The output path (relative or absolute)
 * @param baseDir - Base directory for relative paths
 * @returns The absolute path where the file was written
 */
export function writeScreenshotFile(
  content: Uint8Array,
  outputPath: string,
  baseDir?: string,
): string {
  const options = baseDir ? { baseDir } : {}
  const [writtenPath] = writeFilesToDisk({
    path: outputPath,
    content,
    description: 'map screenshot',
  }, options)

  return writtenPath!
}
