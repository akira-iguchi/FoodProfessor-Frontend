import { AxiosPromise } from 'axios'
import client from 'lib/apis/client'
import { editProfileUrl, updateProfileUrl } from 'urls/index'

export const fetchEditProfileData = (userId: number): Promise<any> => {
  return client
    .get(editProfileUrl(userId))
    .then((res) => {
      return res.data
    })
    .catch((error) => console.log(error))
}

export const UpdateProfileData = (userId: number | undefined, params: FormData): AxiosPromise => {
  return client.put(updateProfileUrl(userId), params)
}
