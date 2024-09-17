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
  try {
    return await auth.elevate(items.queryDataItems)({
      dataCollectionId,
    }).find();
  } catch (e) {
    console.log("failed fetching collection", e);
    throw e;
  }
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
    console.log("Insurance entry does not exist for current checkout", itemId)
  }
};

export const upsertDataToCollection = async ({
  dataCollectionId,
  item
}: { dataCollectionId: string; item: DataItem }) => {
    const collection = await getDataFromCollection({ dataCollectionId });
    const existsInCollection = item._id && collection.items.find(existingItem => existingItem._id === item._id);

    if (item._id && existsInCollection) {
      try {
        await auth.elevate(items.updateDataItem)(item._id, {
          dataCollectionId,
          dataItem: {
            data: {
              _id: item._id,
              ...item.data
            },
          },
        })
      } catch (error) {
        console.log("Failed updating database entry", item._id ,error)
        throw error;
      };
    } else {
      try {
        await auth.elevate(items.insertDataItem)({
          dataCollectionId,
          dataItem: {
            _id: item._id!,
            data: {
              _id: item._id!,
              ...item.data
            },
          },
        });
      } catch(error) {
        console.log("Failed inserting a new entry to collection", dataCollectionId, item, error)
        throw error;
      }
    }
};
