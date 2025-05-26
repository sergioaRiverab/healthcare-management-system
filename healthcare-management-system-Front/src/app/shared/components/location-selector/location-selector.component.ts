import { Component, type OnInit, Input, Output, EventEmitter, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { debounceTime, distinctUntilChanged, Subscription } from "rxjs"

interface LocationResult {
  display_name: string
  lat: string
  lon: string
}

@Component({
  selector: "app-location-selector",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="space-y-2">
    <div class="flex space-x-2">
      <input
        type="text"
        [formControl]="searchControl"
        placeholder="Ej: Carrera 10A # 53-4, Manizales, Caldas"
        class="flex-grow px-4 py-2 border rounded-lg"
      />
      <button
        type="button"
        (click)="geocodeCurrentInput()"
        class="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        [disabled]="!searchControl.value || isGeocoding"
      >
        {{ isGeocoding ? 'Buscando...' : 'Buscar' }}
      </button>
      <button
        type="button"
        (click)="detectCurrentLocation()"
        class="px-3 py-2 bg-emerald-green text-white rounded-lg hover:bg-navy-blue text-sm"
      >
        Mi ubicación
      </button>
    </div>
    
    <!-- Resultados de búsqueda -->
    <div *ngIf="searchResults.length > 0" class="max-h-40 overflow-y-auto border rounded-lg bg-white">
      <div 
        *ngFor="let result of searchResults" 
        (click)="selectLocation(result)"
        class="p-2 hover:bg-gray-100 cursor-pointer border-b"
      >
        {{ result.display_name }}
      </div>
    </div>
    
    <!-- Mensaje de ayuda -->
    <div class="text-xs text-gray-600 bg-blue-50 p-2 rounded">
      <strong>💡 Solución recomendada:</strong><br>
      1. Busca solo la calle principal (ej: "Carrera 10A, Manizales")<br>
      2. Selecciona el resultado más cercano a tu ubicación<br>
      3. Haz clic en el mapa para ajustar el punto exacto<br>
      4. Presiona "Confirmar ubicación manual"
    </div>
    
    <!-- Mensaje de error -->
    <div *ngIf="errorMessage" class="text-red-500 text-sm bg-red-50 p-2 rounded">
      {{ errorMessage }}
    </div>
    
    <!-- Estado de la ubicación seleccionada -->
    <div *ngIf="selectedLocation" class="text-green-600 text-sm bg-green-50 p-2 rounded">
      ✅ <strong>Ubicación confirmada:</strong> {{ selectedLocation.address }}
    </div>
    
    <!-- Mapa -->
    <div id="locationMap" class="h-48 rounded-lg overflow-hidden mt-2 border"></div>
    
    <!-- Botón para confirmar ubicación manual -->
    <button
      *ngIf="marker && !selectedLocation"
      type="button"
      (click)="confirmManualLocation()"
      class="mt-2 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
    >
      Confirmar ubicación manual
    </button>
    
    <p class="text-xs text-gray-500">
      Haz clic en el mapa para seleccionar una ubicación exacta
    </p>
  </div>
`,
})
export class LocationSelectorComponent implements OnInit, OnDestroy {
  @Input() initialLat: number | null = null
  @Input() initialLng: number | null = null
  @Input() initialAddress = ""

  @Output() locationSelected = new EventEmitter<{
    lat: number
    lng: number
    address: string
  }>()

  searchControl = new FormControl("")
  searchResults: LocationResult[] = []
  errorMessage = ""
  private map: any
  marker: any
  private subscription: Subscription = new Subscription()
  private L: any // Leaflet instance

  isGeocoding = false
  selectedLocation: { lat: number; lng: number; address: string } | null = null
  private manualAddressInput = ""

  ngOnInit(): void {
    // Initialize the map
    this.initMap()

    // Set initial values if provided
    if (this.initialAddress) {
      this.searchControl.setValue(this.initialAddress)
    }

    // Subscribe to search input changes
    this.subscription.add(
      this.searchControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
        if (value && value.length > 3) {
          // Guardar el valor original para usarlo en la confirmación manual
          this.manualAddressInput = value
          this.searchLocation(value)
        } else {
          this.searchResults = []
        }
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    if (this.map) {
      this.map.remove()
    }
  }

  private async initMap(): Promise<void> {
    try {
      // Dynamically import Leaflet
      const L = await import("leaflet")
      this.L = L

      // Fix for default markers in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      // Initialize map with default or initial coordinates
      // Centrado en Manizales por defecto
      const lat = this.initialLat || 5.0689
      const lng = this.initialLng || -75.5174

      this.map = L.map("locationMap").setView([lat, lng], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(this.map)

      // Add marker if initial coordinates are provided
      if (this.initialLat && this.initialLng) {
        this.marker = L.marker([this.initialLat, this.initialLng]).addTo(this.map)
      }

      // Add click event to map
      this.map.on("click", (e: any) => {
        const { lat, lng } = e.latlng
        this.updateMarkerPosition(lat, lng)

        // Limpiar la ubicación seleccionada anterior
        this.selectedLocation = null

        // Limpiar la dirección manual guardada para que no interfiera
        this.manualAddressInput = ""
      })

      // Force map to recalculate its size
      setTimeout(() => {
        this.map.invalidateSize()
      }, 100)
    } catch (error) {
      console.error("Error loading map:", error)
      this.errorMessage = "No se pudo cargar el mapa. Por favor, intenta de nuevo."
    }
  }

  private updateMarkerPosition(lat: number, lng: number): void {
    if (!this.map || !this.L) return

    // Remove existing marker if any
    if (this.marker) {
      this.map.removeLayer(this.marker)
    }

    // Create custom icon for better visibility
    const customIcon = this.L.icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    // Add new marker with custom icon
    this.marker = this.L.marker([lat, lng], { icon: customIcon }).addTo(this.map)

    // Add popup to marker
    this.marker.bindPopup("📍 Ubicación seleccionada").openPopup()

    // Center map on new position
    this.map.setView([lat, lng], this.map.getZoom())
  }

  async searchLocation(query: string): Promise<void> {
    try {
      // Simplificar la búsqueda para obtener mejores resultados
      // Eliminar números de casa y apartamento
      const simplifiedQuery = this.simplifyAddress(query)

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(simplifiedQuery)}&countrycodes=co&limit=5`,
        { headers: { "User-Agent": "healthcare-app" } },
      )

      if (!response.ok) {
        throw new Error("Error en la búsqueda")
      }

      const data = await response.json()
      this.searchResults = data
      this.errorMessage = ""
    } catch (error) {
      console.error("Error searching location:", error)
      this.errorMessage = "Error al buscar ubicación. Por favor, intenta de nuevo."
      this.searchResults = []
    }
  }

  // Simplifica la dirección para mejorar resultados de búsqueda
  private simplifyAddress(address: string): string {
    // Extraer solo la calle principal y la ciudad
    const streetMatch = address.match(/\b(carrera|calle|avenida|diagonal|transversal|cra|cl|av|diag|tv)\s+\d+[a-z]?\b/i)
    const cityMatch = address.match(
      /\b(manizales|medellin|bogota|cali|barranquilla|cartagena|pereira|bucaramanga|cucuta|ibague)\b/i,
    )

    let simplified = ""

    if (streetMatch) {
      simplified += streetMatch[0]
    }

    if (cityMatch) {
      simplified += `, ${cityMatch[0]}`
    }

    // Añadir Colombia si no hay nada más
    if (!simplified) {
      return address
    } else {
      return `${simplified}, Colombia`
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`,
        { headers: { "User-Agent": "healthcare-app" } },
      )

      if (!response.ok) {
        throw new Error("Error en geocodificación inversa")
      }

      const data = await response.json()
      return data.display_name || ""
    } catch (error) {
      console.error("Error in reverse geocoding:", error)
      return ""
    }
  }

  selectLocation(result: LocationResult): void {
    const lat = Number.parseFloat(result.lat)
    const lng = Number.parseFloat(result.lon)

    // Update marker on map
    this.updateMarkerPosition(lat, lng)

    // Clear search results
    this.searchResults = []

    // Usar la dirección del resultado seleccionado, no la manual
    const selectedAddress = result.display_name

    // Update search control with the selected address
    this.searchControl.setValue(selectedAddress, { emitEvent: false })

    // Store selected location for display
    this.selectedLocation = {
      lat,
      lng,
      address: selectedAddress,
    }

    // Limpiar la dirección manual
    this.manualAddressInput = ""

    // Clear any error messages
    this.errorMessage = ""

    // Emit the selected location
    this.locationSelected.emit({
      lat,
      lng,
      address: selectedAddress,
    })
  }

  detectCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.errorMessage = "Tu navegador no soporta geolocalización"
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        // Update marker on map
        this.updateMarkerPosition(lat, lng)

        // Obtener dirección aproximada
        const address = await this.reverseGeocode(lat, lng)

        // Store selected location
        this.selectedLocation = {
          lat,
          lng,
          address,
        }

        // Update search control
        this.searchControl.setValue(address, { emitEvent: false })

        // Emit the selected location
        this.locationSelected.emit({
          lat,
          lng,
          address,
        })

        this.errorMessage = ""
      },
      (error) => {
        console.error("Geolocation error:", error)
        this.errorMessage = "No pudimos obtener tu ubicación. Por favor, búscala manualmente."
      },
    )
  }

  async geocodeCurrentInput(): Promise<void> {
    const query = this.searchControl.value?.trim()
    if (!query) {
      this.errorMessage = "Por favor escribe una dirección"
      return
    }

    // Guardar la dirección original
    this.manualAddressInput = query

    this.isGeocoding = true
    this.errorMessage = ""

    try {
      // Simplificar la consulta para obtener mejores resultados
      const simplifiedQuery = this.simplifyAddress(query)

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(simplifiedQuery)}&countrycodes=co&limit=5`,
        { headers: { "User-Agent": "healthcare-app" } },
      )

      if (!response.ok) {
        throw new Error("Error en la búsqueda")
      }

      const data = await response.json()

      if (data.length === 0) {
        // Intentar con solo la ciudad
        const cityMatch = query.match(/\b(manizales|medellin|bogota|cali|barranquilla|cartagena|pereira)\b/i)
        if (cityMatch) {
          const cityResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${cityMatch[0]}, Colombia&limit=1`,
            { headers: { "User-Agent": "healthcare-app" } },
          )

          if (cityResponse.ok) {
            const cityData = await cityResponse.json()
            if (cityData.length > 0) {
              // Centrar el mapa en la ciudad
              const lat = Number.parseFloat(cityData[0].lat)
              const lon = Number.parseFloat(cityData[0].lon)
              this.map.setView([lat, lon], 13)
            }
          }
        }

        this.errorMessage = "No encontramos resultados. Por favor, haz clic en el mapa para marcar tu ubicación exacta."
      } else {
        this.searchResults = data
      }
    } catch (error) {
      console.error("Error geocoding:", error)
      this.errorMessage = "Error al buscar la dirección. Verifica tu conexión e intenta de nuevo."
      this.searchResults = []
    } finally {
      this.isGeocoding = false
    }
  }

  // Confirmar ubicación manual con geocodificación inversa
  async confirmManualLocation(): Promise<void> {
    if (!this.marker) {
      this.errorMessage = "Por favor, haz clic en el mapa para seleccionar una ubicación"
      return
    }

    const position = this.marker.getLatLng()

    // Obtener la dirección real de la ubicación seleccionada
    const realAddress = await this.reverseGeocode(position.lat, position.lng)

    // Usar la dirección real obtenida del mapa, no la que escribió originalmente
    const address = realAddress || this.searchControl.value || "Ubicación personalizada"

    this.selectedLocation = {
      lat: position.lat,
      lng: position.lng,
      address: address,
    }

    // Actualizar el campo de búsqueda con la dirección real
    this.searchControl.setValue(address, { emitEvent: false })

    this.locationSelected.emit({
      lat: position.lat,
      lng: position.lng,
      address: address,
    })

    this.errorMessage = ""
  }
}
