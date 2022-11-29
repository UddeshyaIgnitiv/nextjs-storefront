import { useQuery } from 'react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
import { getSearchSuggestionsQuery } from '@/lib/gql/queries'
import { searchKeys } from '@/lib/react-query/queryKeys'

import type { SearchSuggestionResult } from '@/lib/gql/types'

export interface SearchSuggestionResultType {
  data: SearchSuggestionResult
  isLoading: boolean
  isSuccess: boolean
}

const getSearchSuggestionResult = async (searchTerm: string) => {
  const client = makeGraphQLClient()
  const response = await client.request({
    document: getSearchSuggestionsQuery,
    variables: { query: searchTerm },
  })
  return response.suggestionSearch
}

/**
 * [Query hook] useSearchSuggestionsQueries uses the graphQL query
 *
 * <b>suggestionSearch(query: String, groups: String, pageSize: Int, mid: String, filter: String): SearchSuggestionResult</b>
 *
 * Description : Fetches the search suggestions based on search keyword.
 * User search by any keyword on header's search bar, and result of search suggestion displayed on popover.
 *
 * Parameters passed to function getSearchSuggestionResult(searchTerm: string) => expects search term to get the search suggestion result.
 *
 * On success, returns the received search suggestions.
 *
 * @param searchTerm Accepts a string value
 *
 * @returns 'response.suggestionSearch', which is search suggestions.
 */

export const useSearchSuggestionsQueries = (searchTerm: string): SearchSuggestionResultType => {
  const {
    data = {},
    isLoading,
    isSuccess,
  } = useQuery(
    searchKeys.suggestions(searchTerm),
    () => (searchTerm ? getSearchSuggestionResult(searchTerm) : {}),
    {
      refetchOnWindowFocus: false,
    }
  )

  return { data, isLoading, isSuccess }
}
