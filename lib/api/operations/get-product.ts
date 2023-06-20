import { NextApiRequest } from 'next'

import { getAdditionalHeader } from '../util'
import { fetcher } from '@/lib/api/util'
import { getProductQuery } from '@/lib/gql/queries'

export default async function getProduct(productCode: any, req: NextApiRequest) {
  const variables = {
    productCode,
  }

  const headers = getAdditionalHeader(req)

  const response = await fetcher({ query: getProductQuery, variables }, { headers })
  return response.data?.product
}
