const apiUrl = process.env.VUE_APP_BASE_API.replace('localhost', process.env.VUE_APP_IPV4)

export const apiConfig = {
  apiUrl: `${apiUrl}/app_api/v1`
}
