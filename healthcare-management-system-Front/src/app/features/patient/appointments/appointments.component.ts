// appointments.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PharmacyService, Pharmacy } from '../../../core/services/pharmacy.service';

@Component({
  selector: 'app-appointments',
  standalone: true,              
  imports: [CommonModule],         
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  pharmacies: Pharmacy[] = [];
  selectedId: number | null = null;

  constructor(
    private service: PharmacyService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

ngOnInit(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  import('leaflet').then(L => {
    let map: L.Map;

    // Creamos un icono distinto para la ubicación del usuario
    const youIcon = L.icon({
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Función para iniciar el mapa en unas coordenadas dadas
    const initMap = (lat: number, lng: number) => {
      map = L.map('map').setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(map);

      // Marker de “tú estás aquí”
      L.marker([lat, lng], { icon: youIcon })
        .addTo(map)
        .bindPopup('📍 ¡Aquí estás!').openPopup();

      // Luego cargamos las farmacias cercanas a tu posición
      this.service.getNearby(lat, lng).subscribe(list => {
        this.pharmacies = list;
        list.forEach(p => {
          L.marker([p.lat, p.lng], {
            icon: L.icon({
              iconUrl: 'assets/leaflet/images/marker-icon.png',
              shadowUrl: 'assets/leaflet/images/marker-shadow.png'
            })
          })
          .addTo(map)
          .on('click', () => (this.selectedId = p.id));
        });
      });
    };

    // Pedimos la ubicación al navegador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          initMap(pos.coords.latitude, pos.coords.longitude);
        },
        err => {
          console.warn('No fue posible obtener la ubicación, usando coords por defecto', err);
          initMap(4.9714, -75.5636);
        }
      );
    } else {
      // si no soporta geolocalización
      initMap(4.9714, -75.5636);
    }
  });
}


  onSelect(id: number) {
    this.selectedId = id;
  }
}
