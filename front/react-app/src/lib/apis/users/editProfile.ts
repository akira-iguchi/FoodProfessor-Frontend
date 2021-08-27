import { AxiosPromise } from 'axios'
import client from 'lib/apis/client'
import { EditProfileUrl, UpdateProfileUrl } from 'urls/index'

export const fetchEditProfileData = (userId: number): Promise<any> => {
  return client
    .get(EditProfileUrl(userId))
    .then((res) => {
      return res.data
    })
    .catch((error) => console.log(error))
}

export const UpdateProfileData = (userId: number | undefined, params: FormData): AxiosPromise => {
  return client.put(UpdateProfileUrl(userId), params)
}
