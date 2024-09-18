import { auth } from '@wix/essentials';
import { items } from '@wix/data';
import { additionalFees } from '@wix/ecom/service-plugins/context';
import { CHECKOUT_COLLECTION_ID, SETTINGS_COLLECTION_ID } from '../../../consts';
import {CalculationMethod, EligibleItems, Settings} from '../../../../types';

const getCheckoutDataFromCollection = async (purchaseFlowId: string) => {
  try {
    const { data } = await auth.elevate(items.getDataItem)(
        purchaseFlowId,
        { dataCollectionId: CHECKOUT_COLLECTION_ID },
    );

    return data;
  } catch {
    console.log("Insurance entry does not exist for current checkout", purchaseFlowId)
  }
};

const getSettingsDataFromCollection = async () => {
  return auth.elevate(items.queryDataItems)({
    dataCollectionId: SETTINGS_COLLECTION_ID,
  }).find()
};

additionalFees.provideHandlers({
  calculateAdditionalFees: async ({ request, metadata }) => {
    const [checkoutData, settingsCollection] = await Promise.all([
      getCheckoutDataFromCollection(request.purchaseFlowId!),
      getSettingsDataFromCollection(),
    ]);

    const settings = settingsCollection.items[0]?.data as Settings

    if (!settings.enabled) return additionalFeesResponseWithNoFee(metadata);
    if (settings.eligibleItems === EligibleItems.SHIPPABLE && !shippableItemExists(request)) return additionalFeesResponseWithNoFee(metadata);

    if (checkoutData?.shouldInsure)
      if (settings.calculationMethod === CalculationMethod.FIXED)
        return handleFixedInsuranceFee(settings, metadata);
      else if (settings.calculationMethod === CalculationMethod.PERCENTAGE_FROM_TOTAL)
        return handlePercentageFromTotalInsuranceFee(settings, request, metadata);
      else
        return handlePercentageFromShippingCostInsuranceFee(settings, request, metadata);
    else
      return additionalFeesResponseWithNoFee(metadata);
  },
});

function additionalFeesResponseWithNoFee(metadata: additionalFees.Context): additionalFees.CalculateAdditionalFeesResponse {
  return {
    additionalFees: [],
    currency: metadata.currency!,
  };
}

function additionalFeesResponseWithFee(price: number, metadata: additionalFees.Context): additionalFees.CalculateAdditionalFeesResponse {
  return {
    additionalFees: [{
      name: 'Insurance',
      code: 'wix-insurance-fee',
      price: `${price}`,
    }],
    currency: metadata.currency!,
  };
}

function handleFixedInsuranceFee(settings: Settings, metadata: additionalFees.Context): additionalFees.CalculateAdditionalFeesResponse {
  return additionalFeesResponseWithFee(settings.amount, metadata);
}

function handlePercentageFromTotalInsuranceFee(settings: Settings,
                                               request: additionalFees.CalculateAdditionalFeesRequest,
                                               metadata: additionalFees.Context): additionalFees.CalculateAdditionalFeesResponse {
  if (settings.eligibleItems === EligibleItems.SHIPPABLE)
    return additionalFeesResponseWithFee(sumShippableItemsPrice(request) * (settings.amount / 100), metadata);
  else
    return additionalFeesResponseWithFee(totalItemsPrice(request) * (settings.amount / 100), metadata);
}

function handlePercentageFromShippingCostInsuranceFee(settings: Settings,
                                                      request: additionalFees.CalculateAdditionalFeesRequest,
                                                      metadata: additionalFees.Context): additionalFees.CalculateAdditionalFeesResponse {
  const shippingPrice = maybeShippingPrice(request);
  if (!shippingPrice)
    return additionalFeesResponseWithNoFee(metadata);
  else
    return additionalFeesResponseWithFee(parseFloat(shippingPrice!) * (settings.amount / 100), metadata);
}

function shippableItemExists(request: additionalFees.CalculateAdditionalFeesRequest) {
  return request.lineItems?.some(item => item.physicalProperties?.shippable);
}

function totalItemsPrice(request: additionalFees.CalculateAdditionalFeesRequest): number {
    return request.lineItems?.reduce((acc, item) => acc + parseFloat(item.price!), 0) ?? 0;
}

function sumShippableItemsPrice(request: additionalFees.CalculateAdditionalFeesRequest): number {
    return extractShippableItems(request).reduce((acc, item) => acc + parseFloat(item.price!), 0) ?? 0;
}

function extractShippableItems(request: additionalFees.CalculateAdditionalFeesRequest) {
  return request.lineItems?.filter(item => item.physicalProperties?.shippable ?? false) ?? [];
}

function maybeShippingPrice(request: additionalFees.CalculateAdditionalFeesRequest): string | undefined {
  return request.shippingInfo?.selectedCarrierServiceOption?.cost?.price;
}