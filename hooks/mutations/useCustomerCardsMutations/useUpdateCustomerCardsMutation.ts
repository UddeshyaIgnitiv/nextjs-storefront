import { useMutation, useQueryClient } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { updateCustomerAccountCard } from '@/lib/gql/mutations'
import { customerAccountCardsKeys } from '@/lib/react-query/queryKeys'

import type { CardInput } from '@/lib/gql/types'

interface UpdateCustomerAccountCardDetailsParams {
  cardId: string
  accountId: number
  cardInput: CardInput
}

const updateCustomerAccountCardDetails = async (params: UpdateCustomerAccountCardDetailsParams) => {
  const client = makeGraphQLClient()

  const response = await client.request({
    document: updateCustomerAccountCard,
    variables: params,
  })

  return response.updateCustomerAccountCard
}

/**
 * [ Mutation hook => useUpdateCustomerCardsMutation calls the graphQL mutation
 *
 * updateCustomerAccountCard(accountId: Int!, cardId: String!, cardInput: CardInput): Card
 *
 * Description : Update the existing customer's card information saved into the account.
 *
 * Parameters passed to function updateCustomerAccountCardDetails(params: UpdateCustomerAccountCardDetailsParams) => expects object containing accountId, cardId and cardInput to update the card details.
 *
 * On success, calls invalidateQueries all customerAccountCardsKeys and fetches the updated result.
 *
 * @returns 'response?.updateCustomerAccountCard', which has updated customer's card details like nameOnCard, cardType, contactId etc.
 */

export const useUpdateCustomerCardsMutation = () => {
  const queryClient = useQueryClient()

  return {
    updateSavedCardDetails: useMutation(updateCustomerAccountCardDetails, {
      onSuccess: () => {
        queryClient.invalidateQueries(customerAccountCardsKeys.all)
      },
    }),
  }
}
