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
      const [longitude, latitude] = this.placesService.useLocation;
      const country = await this.determineCountry(longitude, latitude);
      this.getTop50ByCountry(country);
    } else {
      console.error('User location is not available.');
    }
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
      if (distance < minDistance) {
        minDistance = distance;
        nearestCountry = country;
      }
    }

    return nearestCountry;
  }

  async getTop50ByCountry(country: string): Promise<void> {
    // Aquí llama a tu servicio de Spotify para obtener la lista de top 50 del país
    try {
      this.top50List = await this.spotifyService.buscarListasExitosDeTodosLosPaises();
    } catch (error) {
      console.error('Error al obtener la lista de top 50:', error);
    }
  }

  // Supongamos que tienes una función para obtener las coordenadas de los países
  async getCountryCoordinates(): Promise<{ [key: string]: [number, number] }> {
   
    return {
      'US': [37.09024, -95.712891], // Estados Unidos
      'UK': [55.378051, -3.435973], // Reino Unido
      'ES': [40.463667, -3.74922],  // España
      // Otros países...
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
