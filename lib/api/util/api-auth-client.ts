import { APIAuthClient, AppAuthTicket, ShopperAuthClient } from '@kibocommerce/graphql-client'
import { getApiConfig } from './config-helpers'
import vercelFetch from '@vercel/fetch'

const fetch = vercelFetch()
let authTicket: AppAuthTicket | undefined
const authTicketMemCache = {
  // eslint-disable-next-line require-await
  getAuthTicket: async () => authTicket,
  setAuthTicket: (newAuthTicket: AppAuthTicket) => {
    console.log(`set auth`)
    authTicket = newAuthTicket
  },
}
const apiAuthClient = new APIAuthClient(getApiConfig(), fetch, authTicketMemCache)
const shopperAuthClient = new ShopperAuthClient(getApiConfig(), fetch, apiAuthClient)

export { apiAuthClient, shopperAuthClient }