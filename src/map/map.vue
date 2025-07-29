<script setup lang="ts">
import type { MapScreenshotOptions } from '../schemas'
import type { MapReadyEventDetail } from '../types/map-event'
import * as L from 'leaflet'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import './preflight.css'
import 'leaflet/dist/leaflet.css'

const options = ref<MapScreenshotOptions | null>(null)
let map: any = null
let markers: any[] = []

function handleMapConfigure(event: CustomEvent<MapReadyEventDetail>) {
  const { options: eventOptions } = event.detail

  // Set the options
  options.value = eventOptions

  // Initialize map if it doesn't exist
  if (!map) {
    initializeMap()
  }
  else {
    // Clear everything and rebuild
    clearAllMarkersAndPopups()
    updateMapView()
    addAllMarkers()
    openAllPopups()
  }
}

function initializeMap() {
  if (!options.value)
    return

  nextTick(() => {
    // Create map
    map = L.map('leaflet-map', {
      zoomControl: false,
      attributionControl: false,
    }).setView(options.value!.center, options.value!.zoom!)

    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map)

    // Add all markers and open popups
    addAllMarkers()
    openAllPopups()
  })
}

function clearAllMarkersAndPopups() {
  // Close all popups first
  closeAllPopups()

  // Remove all markers from map
  markers.forEach((marker) => {
    if (map && marker) {
      map.removeLayer(marker)
    }
  })

  // Clear markers array
  markers = []
}

function updateMapView() {
  if (!options.value || !map)
    return
  map.setView(options.value.center, options.value.zoom!)
}

function addAllMarkers() {
  if (!options.value?.markers || !map)
    return

  options.value.markers.forEach((markerData, index) => {
    const marker = L.marker(markerData.position, {
      icon: L.icon({
        iconUrl: markerIconPng,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
      }),
    }).addTo(map)

    if (markerData.popupText) {
      marker.bindPopup(markerData.popupText, {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      })
    }

    markers[index] = marker
  })
}

function openAllPopups() {
  markers.forEach((marker) => {
    if (marker && marker.getPopup()) {
      marker.openPopup()
    }
  })
}

function closeAllPopups() {
  if (map) {
    map.eachLayer((layer: any) => {
      if (layer.closePopup) {
        layer.closePopup()
      }
    })
  }
}

onMounted(() => {
  window.addEventListener('map-configure', (data) => {
    handleMapConfigure(data)
  })

  if (import.meta.env.DEV) {
  // emit global event for dev mode
    window.dispatchEvent(new CustomEvent('map-configure', {
      detail: {
        options: {
          center: [51.5074, -0.1278],
          zoom: 14,
          width: 800,
          height: 600,
          isRounded: false,
          markers: [
            { position: [51.4994, -0.1245], popupText: 'Big Ben' },
            { position: [51.5033, -0.1195], popupText: 'London Eye' },
          ],
        } satisfies MapScreenshotOptions,
      },
    }))
  }
})

onUnmounted(() => {
  window.removeEventListener('map-configure', (data) => {
    handleMapConfigure(data)
  })
})
</script>

<template>
  <div
    v-if="options"
    :style="{
      height: `${options.height}px`,
      width: `${options.width}px`,
      borderRadius: options.isRounded ? '50%' : '0',
      overflow: 'hidden',
    }"
  >
    <div
      id="leaflet-map"
      :style="{
        height: '100%',
        width: '100%',
      }"
    />
  </div>
</template>
