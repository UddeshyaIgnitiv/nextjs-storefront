import { useMutation, useQueryClient } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { createAccountAndLoginMutation } from '@/lib/gql/mutations/user/createAccount'
import { loginKeys } from '@/lib/react-query/queryKeys'

import { CustomerAccountAndAuthInfoInput } from '@/lib/gql/types'

const client = makeGraphQLClient()
const registerUser = async (customerAccountAndAuthInfoInput: CustomerAccountAndAuthInfoInput) => {
  const response = await client.request({
    document: createAccountAndLoginMutation,
    variables: { customerAccountAndAuthInfoInput },
  })
  return response?.account
}

/**
 * [ Mutation hook => createCustomerAccountAndLogin(customerAccountAndAuthInfoInput: $customerAccountAndAuthInfoInput) ]
 *
 * Description : It creates account for user and logIn user into account created
 *
 * Parameters passed to function registerUser(customerAccountAndAuthInfoInput: CustomerAccountAndAuthInfoInput) => expects object of type ' CustomerAccountAndAuthInfoInput' containing account?: InputMaybe<CustomerAccountInput> | undefined;
 *  externalPassword?: InputMaybe<string> | undefined;
 *  isImport?: InputMaybe<boolean> | undefined;
 *  password?: InputMaybe<...> | undefined;
 *
 * On success, calls invalidateQueries on loginKeys
 * @returns 'response?.account' containing information related to user account
 */
export const useUserAccountRegistrationMutations = () => {
  const queryClient = useQueryClient()
  const {
    mutate,
    mutateAsync,
    data = {},
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation(registerUser, {
    onMutate: () => {
      queryClient.invalidateQueries(loginKeys.user)
    },
    retry: 0,
  })

  return {
    mutate,
    mutateAsync,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  }
}
