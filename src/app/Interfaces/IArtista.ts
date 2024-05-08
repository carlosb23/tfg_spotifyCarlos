import { IMusica } from "./IMusica"

export interface IArtista {
    id: string
    name: string
    imagenUrl: string
    musicas?: IMusica[]
}