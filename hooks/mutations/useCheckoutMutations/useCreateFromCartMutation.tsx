import { useMutation } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { getOrCreateCheckoutFromCartMutation } from '@/lib/gql/queries'

const getOrCreateCheckout = async (cartId?: string | null) => {
  const client = makeGraphQLClient()

  const response = await client.request({
    document: getOrCreateCheckoutFromCartMutation,
    variables: { cartId },
  })

  return response?.checkout
}

/**
 * [ Mutation hook => useCreateFromCartMutation uses the graphlql mutation 'createOrder(cartId: $cartId)' ]
 *
 * Description : Prepares data for checkout page from cart
 *
 * Parameters passed to function getOrCreateCheckout(cartId?: string | null) => expects cartId
 *
 * @returns 'response?.checkout' data for checkout pages
 */
export const useCreateFromCartMutation = () => {
  return {
    createFromCart: useMutation(getOrCreateCheckout),
  }
}
