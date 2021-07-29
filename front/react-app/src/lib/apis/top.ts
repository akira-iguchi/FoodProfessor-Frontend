import axios from 'axios'
import { topPageUrl } from 'urls/index'

export const fetchTopData = () => {
  return axios
    .get(topPageUrl)
    .then((res) => {
      return res.data
    })
    .catch((e) => console.error(e))
}
