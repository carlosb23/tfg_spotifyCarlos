import { IArtista } from "../Interfaces/IArtista";
import { IMusica } from "../Interfaces/IMusica";
import { IPlaylist } from "../Interfaces/IPlaylist";


export function newMusica(): IMusica {
    return {
      id: '',
      previewUrl: '',
      album: {
        id: '',
        imagenUrl: '',
        name: '',
      },
      artistas: [],
      tiempo: '',
      titulo: ''
    }
  }

export function newArtista(): IArtista {
    return {
      id: '',
      imagenUrl: '',
      name: '',
      musicas: []
    }
  }

export function newPlaylist(): IPlaylist {
    return {
      id: '',
      name: '',
      imagenUrl: '',
      musicas: [],
    }
  }