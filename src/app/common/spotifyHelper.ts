import { IUsuario } from "../Interfaces/IUsuario";

export function SpotifyUserParaUsuario(user: SpotifyApi.CurrentUsersProfileResponse): IUsuario{
    return {
      id: user.id,
      name: user.display_name,
      imagenUrl: user.images.pop().url
    }
 }