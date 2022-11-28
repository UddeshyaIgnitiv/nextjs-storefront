import { useMutation, useQueryClient } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { deleteCartItemMutation } from '@/lib/gql/mutations'
import { cartKeys } from '@/lib/react-query/queryKeys'

import type { CartItem } from '@/lib/gql/types'

interface RemoveCartItemParams {
  cartItemId: string
}

const removeCartItem = async (params: RemoveCartItemParams) => {
  const client = makeGraphQLClient()
  const { cartItemId } = params

  const variables = {
    itemId: cartItemId,
  }
  const response = await client.request({
    document: deleteCartItemMutation,
    variables,
  })

  return response?.deleteCartItemMutation
}

/**
 * [ Mutation hook => useRemoveCartItemMutation uses the graphlql mutation 'deleteCurrentCartItem(cartItemId: String!): Boolean' ]
 *
 * Description : Removes the product item from the cart
 *
 * Parameters passed to function removeCartItem(params: RemoveCartItemParams) => expects object containing cartItemId of the product to be deleted
 *
 * On success, calls invalidateQueries on cartKeys and fetches the updated result
 * @returns 'response?.deleteCartItemMutation' and removes product from the cart
 */
export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient()
  return {
    removeCartItem: useMutation(removeCartItem, {
      onMutate: async (deleteCartItem) => {
        await queryClient.cancelQueries()

        const previousCart: any = queryClient.getQueryData(cartKeys.all)
        const newCart = previousCart?.items?.filter(
          (item: CartItem) => item.id !== deleteCartItem.cartItemId
        )
        queryClient.setQueryData(cartKeys.all, newCart)

        return { previousCart }
      },
      onError: (_err, _newCart, context: any) => {
        queryClient.setQueryData(cartKeys.all, context?.previousCart)
      },
      onSettled: () => {
        queryClient.invalidateQueries(cartKeys.all)
      },
    }),
  }
}
