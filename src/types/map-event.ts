import type { MapScreenshotOptions } from '../schemas'

export interface MapReadyEventDetail {
  options: MapScreenshotOptions
}

declare global {
  interface WindowEventMap {
    'map-configure': CustomEvent<MapReadyEventDetail>
    'map-ready': CustomEvent<void>
  }
}
