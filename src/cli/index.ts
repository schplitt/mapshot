#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import packageJson from '../../package.json'

const main = defineCommand({
  meta: {
    name: 'mapshot',
    version: packageJson.version,
    description: 'Generate map screenshots with markers',
  },
  subCommands: {
    snap: () => import('./commands/snap').then(r => r.default),
    mcp: () => import('./commands/mcp').then(r => r.default),
  },
})

runMain(main)
