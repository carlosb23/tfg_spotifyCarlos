import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  public useLocation: [number, number];

  get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }

  constructor() {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      this.getUserLocation();
    }
  }

  public async getUserLocation(): Promise<[number, number]> {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return Promise.reject(new Error('Geolocation is not available'));
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.useLocation = [coords.latitude, coords.longitude];
          resolve(this.useLocation);
        },
        (err) => {
          console.error('Error al obtener la ubicación del usuario:', err);
          reject(err);
        }
      );
    });
  }
}