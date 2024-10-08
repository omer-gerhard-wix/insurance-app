import { getDataFromCollection, upsertDataToCollection } from '../../database';
import { SETTINGS_COLLECTION_ID, DEFAULT_SETTING } from '../../consts';
import type { Settings } from '../../../types';

export async function GET(req: Request) {
  const settingsCollection = await getDataFromCollection({
    dataCollectionId: SETTINGS_COLLECTION_ID,
  });

  const settingsData: Settings = settingsCollection.items[0]?.data as Settings;
  const settings: Settings = {
    title: settingsData?.title || DEFAULT_SETTING.title,
    description: settingsData?.description || DEFAULT_SETTING.description,
    amount: settingsData?.amount || DEFAULT_SETTING.amount,
    enabled: settingsData?.enabled === undefined ? DEFAULT_SETTING.enabled : settingsData.enabled,
    calculationMethod: settingsData?.calculationMethod || DEFAULT_SETTING.calculationMethod,
    eligibleItems: settingsData?.eligibleItems || DEFAULT_SETTING.eligibleItems,
    onByDefault: settingsData?.onByDefault === undefined ? DEFAULT_SETTING.onByDefault : settingsData.onByDefault,
  };

  return new Response(JSON.stringify(settings));
};

export async function POST(req: Request) {
  const settingsData = await req.json() as Settings;

  try {
    await upsertDataToCollection({
      dataCollectionId: SETTINGS_COLLECTION_ID,
      item: {
        // Wix data collection can be initialized as a "single item" that has the same ID
        _id: 'SINGLE_ITEM_ID',
        data: settingsData,
      },
    });

    return new Response('Success');
  } catch (error) {
    console.log(error);
    return new Response('Error');
  };
};
