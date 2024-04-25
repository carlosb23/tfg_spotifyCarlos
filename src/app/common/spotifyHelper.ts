import { IPlaylist } from "../Interfaces/IPlaylist";
import { IUsuario } from "../Interfaces/IUsuario";

export function SpotifyUserParaUsuario(user: SpotifyApi.CurrentUsersProfileResponse): IUsuario{
    return {
      id: user.id,
      name: user.display_name,
      imagenUrl: user.images.pop().url
    }
 }

 export function SpotifyPlaylistParaPlaylist(playlist: SpotifyApi.PlaylistObjectSimplified): IPlaylist {
  return {
      name: playlist.name,
      country: '', 
      songs: [] 
  };
}