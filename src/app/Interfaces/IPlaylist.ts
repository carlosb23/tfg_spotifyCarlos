export interface IPlaylist {
    name: string,
    country: string,
    songs: {
        id: string,
        name: string,
        artistas: string,
        imagenUrl: string
    }[]
}