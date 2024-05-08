
import { addMilliseconds, format } from "date-fns";
import { IMusica } from "../Interfaces/IMusica";
import { IPlaylist } from "../Interfaces/IPlaylist";
import { IUsuario } from "../Interfaces/IUsuario";
import { newMusica, newPlaylist } from "./spotifyHelper2";

export function SpotifyUserParaUsuario(user: SpotifyApi.CurrentUsersProfileResponse): IUsuario{
    return {
      id: user.id,
      name: user.display_name,
      imagenUrl: user.images.pop().url
    }
 }

 export function SpotifyPlaylistParaPlaylist(playlist: SpotifyApi.SinglePlaylistResponse): IPlaylist {
  return {
      id: playlist.id,
      name: playlist.name,
      imagenUrl: playlist.images.length > 0 ? playlist.images[0].url : '' // Obtener la URL de la imagen de la lista de reproducción
  };
}

export function SpotifySinglePlaylistParaPlaylist(playlist: SpotifyApi.SinglePlaylistResponse) { 
  if(!playlist)
    return newPlaylist();

  return {
    id: playlist.id,
    name: playlist.name,
    imagenUrl: playlist.images.length > 0 ? playlist.images[0].url : '',
    musicas: []
  }
}

export function SpotifyTrackParaMusica(track: SpotifyApi.TrackObjectFull): IMusica {

  if(!track)
    return newMusica();

  const mstiempo = (ms: number) => {
    const data = addMilliseconds(new Date(0), ms);
    return format(data, 'mm:ss');
  }
    
  

  return {
    id: track.uri,
    titulo: track.name,
    previewUrl: track.preview_url,
    album: {
      id: track.album.id,
      name: track.album.name,
      imagenUrl: track.album.images[0].url
    },

    artistas: track.artists.map(artista => ({
      id: artista.id,
      name: artista.name
    })),
    tiempo: mstiempo(track.duration_ms),
      
  }

}


