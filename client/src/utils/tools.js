import cookie from 'react-cookies'

export const getTokenCookie = () => cookie.load('x-access-token')
export const removeTokenCookie = () => cookie.remove('x-access-token')
export const getAuthHeader = () => {
  return { headers: { 'x-access-token': getTokenCookie() } }
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const currencyFormatter = new Intl.NumberFormat('es-ES', {
  currency: 'eur',
  style: 'currency',
  minimumFractionDigits: 0,
})
