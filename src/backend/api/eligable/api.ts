import { getDataFromCollection } from '../../database';
import { SETTINGS_COLLECTION_ID, DEFAULT_SETTING } from '../../consts';
import type { Settings } from '../../../types';
import { checkout } from "@wix/ecom";

export async function GET(req: Request) {
  const settingsCollection = await getDataFromCollection({
    dataCollectionId: SETTINGS_COLLECTION_ID,
  });

  const settingsData: Settings = settingsCollection.items[0]?.data as Settings;
  const enabled = settingsData?.enabled === undefined ? DEFAULT_SETTING.enabled : settingsData.enabled;
  const eligibleItems =  settingsData?.eligibleItems || DEFAULT_SETTING.eligibleItems;
  if(enabled && eligibleItems === 'SHIPPABLE') {
    const checkoutId = new URL(req.url).searchParams.get('checkoutId') as string;
    const response = await checkout.getCheckout(checkoutId);
    const isShippableCheckout = response?.lineItems?.some(item => item.physicalProperties?.shippable);
    return new Response(JSON.stringify(isShippableCheckout));
  } else return new Response(JSON.stringify(enabled));



};