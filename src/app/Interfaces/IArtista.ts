import { IMusica } from "./IMusica"

export interface IArtista {
    id: string;
    name: string;
    images: SpotifyImage[];
    musicas?: IMusica[];
}

export interface SpotifyImage {
    url: string;
}