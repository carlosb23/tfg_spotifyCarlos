import { IMusica } from "./IMusica"

export interface IPlaylist {
    id: string,
    name: string,
    imagenUrl: string,
    musicas?: IMusica[],
}
