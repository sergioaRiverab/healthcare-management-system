// appointments.component.ts
import { Component, OnInit, OnDestroy, Inject, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PharmacyService, Pharmacy } from '../../../core/services/pharmacy.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  @Output() pharmacySelected = new EventEmitter<Pharmacy>();

  pharmacies: Pharmacy[] = [];
  selectedPharmacy: Pharmacy | null = null;

  private map!: any;
  private pharmacyMarkers: any[] = [];
  private selectedMarker?: any;
  private userMarker?: any;
  private subscriptions = new Subscription();
  private L!: any;
  private platformId: any;

  constructor(
    private pharmacyService: PharmacyService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.initializeMap();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectPharmacy(ph: Pharmacy): void {
    this.selectedPharmacy = ph;
    this.pharmacySelected.emit(ph);
    this.focusOnPharmacy(ph);
  }

  private async initializeMap(): Promise<void> {
    const L = await import('leaflet');
    this.L = L;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const startMap = (lat: number, lng: number) => {
      this.map = L.map('map').setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      this.userMarker = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup('📍 Tu ubicación');

      this.subscriptions.add(
        this.pharmacyService.getNearby(lat, lng).subscribe(list => {
          this.pharmacies = list.slice(0, 4);
          this.addPharmacyMarkers(this.pharmacies);
        })
      );
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => startMap(pos.coords.latitude, pos.coords.longitude),
        ()  => startMap(4.9714, -75.5636)
      );
    } else {
      startMap(4.9714, -75.5636);
    }
  }

  private addPharmacyMarkers(list: Pharmacy[]): void {
    const L = this.L;
    this.pharmacyMarkers.forEach(m => this.map.removeLayer(m));
    this.pharmacyMarkers = [];

    list.forEach(ph => {
      const marker = L.marker([ph.lat, ph.lng])
        .addTo(this.map)
        .bindPopup(`
          <div>
            <h3>${ph.name}</h3>
            <p>${ph.distance.toFixed(2)} km</p>
          </div>
        `);
      marker.on('click', () => this.selectPharmacy(ph));
      this.pharmacyMarkers.push(marker);
    });
  }

  private focusOnPharmacy(ph: Pharmacy): void {
    if (!this.map) return;
    const L = this.L;

    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
    }

    this.selectedMarker = L.marker([ph.lat, ph.lng])
      .addTo(this.map)
      .bindPopup(`
        <div>
          ✅ <strong>${ph.name}</strong><br>
          ${ph.distance.toFixed(2)} km
        </div>
      `);

    this.map.setView([ph.lat, ph.lng], 15);
    this.selectedMarker.openPopup();
  }
}
