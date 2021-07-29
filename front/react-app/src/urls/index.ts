const DEFAULT_API_LOCALHOST = 'http://localhost:3000/api'

export const topPageUrl = `${DEFAULT_API_LOCALHOST}/top`
export const registerUrl = `${DEFAULT_API_LOCALHOST}/auth`
export const loginUrl = `${DEFAULT_API_LOCALHOST}/auth/sign_in`
export const logOutUrl = `${DEFAULT_API_LOCALHOST}/auth/sign_out`
export const sessionsUrl = `${DEFAULT_API_LOCALHOST}/auth/sessions`
export const userProfileUrl = (userId: number) => `${DEFAULT_API_LOCALHOST}/users/${userId}`
