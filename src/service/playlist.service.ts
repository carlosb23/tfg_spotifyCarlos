import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private playlistIdSubject = new BehaviorSubject<string>('');

  constructor() { }

  setPlaylistId(playlistId: string) {
    this.playlistIdSubject.next(playlistId);
  }

  getPlaylistId() {
    return this.playlistIdSubject.asObservable();
  }
}
