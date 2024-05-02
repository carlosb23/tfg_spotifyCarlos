import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../service/spotify.service';
import { PlacesService } from '../../../service/places.service';
import { IPlaylist } from '../../Interfaces/IPlaylist';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top50ubi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top50ubi.component.html',
  styleUrl: './top50ubi.component.css'
})
export class Top50ubiComponent implements OnInit {

  top50List: IPlaylist[] = [];

  

  constructor(private placesService: PlacesService, private spotifyService: SpotifyService) { }


  async ngOnInit(): Promise<void> {
    if (this.placesService.isUserLocationReady) {
      const [latitude, longitude] = this.placesService.useLocation;
      const country = await this.determineCountry(latitude, longitude);
      this.getTop50ByCountry(country);
    } else {
      console.error('User location is not available.');
    }

    this.obtenerUbicacion();
  }

  async determineCountry(longitude: number, latitude: number): Promise<string> {
    // Supongamos que tienes una función para obtener las coordenadas de los países
    const countryCoordinates = await this.getCountryCoordinates();

    // Calcula la distancia entre la ubicación del usuario y las coordenadas de cada país
    // y devuelve el país más cercano
    let nearestCountry = '';
    let minDistance = Infinity;

    for (const [country, [countryLongitude, countryLatitude]] of Object.entries(countryCoordinates)) {
      const distance = this.calculateDistance(longitude, latitude, countryLongitude, countryLatitude);
      console.log(`Distance to ${country}: ${distance} km`);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCountry = country;
      }
    }

    return nearestCountry;
  }

  async obtenerUbicacion() {
    try {
      await this.placesService.getUserLocation();
      console.log('User location:', this.placesService.useLocation);
      const [longitude, latitude] = this.placesService.useLocation;
      const country = await this.determineCountry(longitude, latitude);
      this.getTop50ByCountry(country);
    } catch (error) {
      console.error('Error al obtener la ubicación del usuario:', error);
    }
  }
  async getTop50ByCountry(country: string): Promise<void> {
    try {
      if (country) {
        // Obtener la lista de reproducción del país del usuario
        this.top50List = await this.spotifyService.buscarListasExitosDePais(country);
      } else {
        // Si no se puede determinar la ubicación del usuario, obtener la lista global
        this.top50List = await this.spotifyService.buscarListasExitosUbi();
      }
    } catch (error) {
      console.error('Error al obtener la lista de top 50:', error);
    }
  }

  // Supongamos que tienes una función para obtener las coordenadas de los países
  async getCountryCoordinates(): Promise<{ [key: string]: [number, number] }> {
   
    return {
      'US': [37.09024, -95.712891], // Estados Unidos
      'UK': [55.378051, -3.435973], // Reino Unido
      'ES': [36.7213, 4.4215],  // España
      'FR': [46.603354, 1.888334],
      'BR': [-14.235004, -51.92528],
      'DE': [51.165691, 10.451526],
      'IT': [42.960175, 12.632208],
      'JP': [36.204824, 138.252924],
      'AU': [-25.274398, 133.775136],
      'BE': [50.503887, 4.469936]
    };
  }

  // Calcula la distancia entre dos puntos geográficos utilizando la fórmula de Haversine
  calculateDistance(lon1: number, lat1: number, lon2: number, lat2: number): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

  // Convierte grados a radianes
  degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }
}
