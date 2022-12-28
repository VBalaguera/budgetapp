import cookie from 'react-cookies'

export const getTokenCookie = () => cookie.load('x-access-token')
export const removeTokenCookie = () => cookie.remove('x-access-token')
export const getAuthHeader = () => {
  return { headers: { 'x-access-token': getTokenCookie() } }
}
