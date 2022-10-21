import React, { useState } from 'react'

import { ArrowBackIos } from '@mui/icons-material'
import { Divider, Grid, Typography, Box, Stack, Button, MenuItem } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { KiboImage, KiboSelect, ProductItemList } from '@/components/common'
import { OrderReturnItemsDialog } from '@/components/dialogs'
import { ProductOption } from '@/components/product'
import { useModalContext } from '@/context'
import {
  useReturnReasonsQueries,
  useReturnsQueries,
  useCreateOrderReturnItemsMutation,
} from '@/hooks'
import { OrderStatus, OrderReturnType } from '@/lib/constants'
import { orderGetters, productGetters } from '@/lib/getters'
import { CreateOrderReturnItemsInputParams } from '@/lib/types'

import type { Maybe, Order, CrOrderItem, CrProduct } from '@/lib/gql/types'

interface OrderReturnItemsProps {
  order: Order
  title: string
  onGoBackToOrderDetails?: () => void
}

const styles = {
  container: {
    paddingBlock: 2,
  },
  wrapIcon: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    cursor: 'pointer',
  },
  divider: {
    borderColor: 'grey.500',
  },
}

const OrderReturnItems = (props: OrderReturnItemsProps) => {
  const { order, title, onGoBackToOrderDetails } = props
  const { t } = useTranslation('common')

  const [selectedReturnItems, setSelectedReturnItems] = useState<Maybe<CrOrderItem>[]>([])
  const [selectedReturnReason, setSelectedReturnReason] = useState<string>('')
  const [isReturnRequestSuccess, setIsReturnRequestSuccess] = useState<boolean>(false)

  const { showModal, closeModal } = useModalContext()

  const { data: returnReasons } = useReturnReasonsQueries()
  const { data: returnOrder } = useReturnsQueries({
    filter: `originalOrderId eq ${order?.id}`,
  })
  const { createReturnItems } = useCreateOrderReturnItemsMutation()

  const orderNumber = orderGetters.getOrderNumber(order)
  const orderTotal = orderGetters.getTotal(order)
  const submittedDate = orderGetters.getSubmittedDate(order)
  const pickupItems = orderGetters.getPickupItems(order)
  const shipItems = orderGetters.getShipItems(order)

  const handleGoBackToOrderDetails = () => onGoBackToOrderDetails && onGoBackToOrderDetails()
  const handleReturnItems = (orderItemId: string) => {
    if (
      selectedReturnItems?.filter((orderItem: Maybe<CrOrderItem>) => orderItem?.id === orderItemId)
        ?.length
    ) {
      setSelectedReturnItems(
        selectedReturnItems?.filter(
          (orderItem: Maybe<CrOrderItem>) => orderItem?.id !== orderItemId
        )
      )
    } else {
      const selectedItem = order?.items?.filter(
        (orderItem: Maybe<CrOrderItem>) => orderItem?.id === orderItemId
      )
      selectedItem?.length && setSelectedReturnItems([...selectedReturnItems, ...selectedItem])
    }
  }

  const handleReturnReasonSelection = (name: string, value: string) =>
    setSelectedReturnReason(value)

  const handleConfirmReturnRequest = async () => {
    const createReturnItemsParams: CreateOrderReturnItemsInputParams = {
      returnType: OrderReturnType.REFUND,
      reason: selectedReturnReason,
      notes: '',
      originalOrderId: order?.id as string,
      items: selectedReturnItems,
      locationCode: orderGetters.getLocationCode(order) as string,
    }
    const createReturnItemsResponse = await createReturnItems.mutateAsync(createReturnItemsParams)

    if (createReturnItemsResponse?.status === OrderStatus.CREATED) {
      setIsReturnRequestSuccess(true)

      showModal({
        Component: OrderReturnItemsDialog,
        props: {
          orderItems: selectedReturnItems,
          reason: selectedReturnReason,
          closeModal,
        },
      })
    }
  }
  return (
    <>
      <Stack
        sx={{ ...styles.wrapIcon, py: '1.2rem' }}
        direction="row"
        gap={2}
        onClick={handleGoBackToOrderDetails}
      >
        <ArrowBackIos fontSize="inherit" sx={styles.wrapIcon} />
        <Typography variant="body2">{t('order-details')}</Typography>
      </Stack>

      <Grid container data-testid="ViewOrderDetails">
        {/* Header section */}
        <Grid item xs={12} md={7}>
          <Typography variant="h1" gutterBottom>
            {title}
          </Typography>
          <Divider sx={{ borderColor: 'primary.main' }} />
        </Grid>

        {/* Order Details Section */}
        <Grid item xs={12} md={7}>
          <Box sx={{ ...styles.container }}>
            <ProductOption
              option={{ name: t('order-number'), value: orderNumber }}
              variant="body1"
            />
            <ProductOption
              option={{ name: t('order-date'), value: submittedDate }}
              variant="body1"
            />
            <ProductOption
              option={{
                name: t('order-total'),
                value: `${t('currency', { val: orderTotal })} (${t('item-quantity', {
                  count: order.items?.length,
                })})`,
              }}
              variant="body1"
            />
          </Box>
          <Divider sx={{ ...styles.divider }} />
          {/* Return reason & comment */}
          <Box>
            <Typography pt={2} pb={0.5}>
              {t('reason-for-your-return')}
            </Typography>
            <KiboSelect
              name="returnReasons"
              placeholder={t('choose-a-response')}
              sx={{ maxWidth: '23.5rem' }}
              value={selectedReturnReason}
              onChange={handleReturnReasonSelection}
            >
              {returnReasons &&
                Object.values(returnReasons)?.map((reason: string) => {
                  return (
                    <MenuItem key={reason} value={`${reason}`}>
                      {`${reason}`}
                    </MenuItem>
                  )
                })}
            </KiboSelect>
          </Box>
          {/* Shipment orders */}
          {!!shipItems.length && (
            <Box>
              <Box sx={{ ...styles.container }}>
                <ProductItemList
                  items={shipItems}
                  showAddress={false}
                  showCheckbox={true}
                  showDivider={false}
                  disableCheckbox={isReturnRequestSuccess}
                  onSelectItem={(orderItemId: string) => handleReturnItems(orderItemId)}
                />
              </Box>
              <Divider sx={{ ...styles.divider }} />
            </Box>
          )}
          {/* Pickup orders */}
          {!!pickupItems.length && (
            <Box>
              <Box sx={{ ...styles.container }}>
                <ProductItemList
                  items={pickupItems}
                  showAddress={false}
                  showCheckbox={true}
                  showDivider={false}
                  disableCheckbox={isReturnRequestSuccess}
                  onSelectItem={(orderItemId: string) => handleReturnItems(orderItemId)}
                />
              </Box>
            </Box>
          )}
        </Grid>
        {/* Selected Order Return Items */}

        <Grid item xs={12} md={5} sx={{ paddingX: { xs: 0, md: 2 } }}>
          <Box sx={{ bgcolor: 'grey.100', minHeight: '10.625rem', maxWidth: '26.75rem' }}>
            <Box sx={{ pl: '1.438rem', pt: '1.75rem', pr: '1.813rem' }}>
              <Typography variant="h4" fontWeight={'bold'}>
                {t('items-you-are-returning')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: '1.25rem' }}>
                {selectedReturnItems?.map((item: Maybe<CrOrderItem>) => (
                  <Box
                    key={item?.id}
                    sx={{ mr: '1.563rem', mb: '1.563rem', backgroundColor: '#fff' }}
                  >
                    <KiboImage
                      src={productGetters.handleProtocolRelativeUrl(
                        productGetters.getProductImage(item?.product as CrProduct)
                      )}
                      height={134}
                      width={134}
                      alt={productGetters.getName(item?.product as CrProduct)}
                      objectFit="contain"
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            <Divider sx={{ ...styles.divider, mb: '1.688rem' }} />
            <Box sx={{ pl: '1.438rem', pb: '2.063rem', pr: '1.813rem' }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleConfirmReturnRequest}
                disabled={
                  !selectedReturnItems.length ||
                  selectedReturnReason === '' ||
                  isReturnRequestSuccess
                }
              >
                {t('confirm-return-request')}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default OrderReturnItems