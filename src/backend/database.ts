import { items } from '@wix/data';
import { auth } from '@wix/essentials';

// Exposing utility functions over Wix Data APIs for easier usage and replacement of database

type DataItem = {
  _id?: string;
  data: Record<string, any>;
};

export const getDataFromCollection = async ({
  dataCollectionId
}: { dataCollectionId: string }) => {
  const data = await auth.elevate(items.queryDataItems)({
    dataCollectionId,
  }).find();

  return data;
};

export const safelyGetItemFromCollection = async ({
  dataCollectionId,
  itemId
}: { dataCollectionId: string; itemId: string }) => {
  try {
    const { data } = await auth.elevate(items.getDataItem)(
      itemId,
      { dataCollectionId },
    );

    return data;
  } catch (error) {
    console.log("error fetching data from collection: ", itemId, error)
  }
};

export const upsertDataToCollection = async ({
  dataCollectionId,
  item
}: { dataCollectionId: string; item: DataItem }) => {
  const collection = await getDataFromCollection({ dataCollectionId });
  const existsInCollection = item._id && collection.items.find(existingItem => existingItem._id === item._id);

  if (item._id && existsInCollection) {
    await auth.elevate(items.updateDataItem)(item._id, {
      dataCollectionId,
      dataItem: {
        data: {
          _id: item._id,
          ...item.data
        },
      },
    });
  } else {
    try {
      await auth.elevate(items.insertDataItem)({
        dataCollectionId,
        dataItem: {
          _id: item._id ?? undefined,
          data: {
            ...item.data
          },
        },
      });
    } catch(error) {
        console.log("error upserting data to collection: ", dataCollectionId, item)
    }
  };
};
