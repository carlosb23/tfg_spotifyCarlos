import { IMusica } from "../Interfaces/IMusica";


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