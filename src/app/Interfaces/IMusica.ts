export interface IMusica {
    id: string,
    titulo: string,
    previewUrl: string,
    artistas:{
        id: string,
        name: string
    }[],
    album: {
        id: string,
        name: string,
        imagenUrl: string
    },
    tiempo: string
}