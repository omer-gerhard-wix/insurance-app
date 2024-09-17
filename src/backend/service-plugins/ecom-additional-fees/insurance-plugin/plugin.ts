import { auth } from '@wix/essentials';
import { items } from '@wix/data';
import { additionalFees } from '@wix/ecom/service-plugins/context';
import { CHECKOUT_COLLECTION_ID, SETTINGS_COLLECTION_ID, DEFAULT_SETTING } from '../../../consts';
import type { Settings } from '../../../../types';

const getCheckoutDataFromCollection = async (purchaseFlowId: string) => {
  try {
    const { data } = await auth.elevate(items.getDataItem)(
        purchaseFlowId,
        { dataCollectionId: CHECKOUT_COLLECTION_ID },
    );

    return data;
  } catch (error) {
    // Wix data's "getDataItem" API throws exception when item with id does not exist
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
      getCheckoutDataFromCollection(request.purchaseFlowId ?? ''),
      getSettingsDataFromCollection(),
    ]);

    if (checkoutData?.shouldInsure) {
      const settingsData = settingsCollection.items[0]?.data as Settings;

      return {
        additionalFees: [{
          name: 'Insurance Fee',
          code: 'wix-insurance-fee',
          price: `${settingsData.amount ?? DEFAULT_SETTING.amount}`,
        }],
        currency: metadata.currency!,
      };
    } else {
      return {
        additionalFees: [],
        currency: metadata.currency!,
      };
    };
  },
});