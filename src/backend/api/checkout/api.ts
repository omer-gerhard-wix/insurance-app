import { upsertDataToCollection, safelyGetItemFromCollection } from '../../database';
import { CHECKOUT_COLLECTION_ID } from '../../consts';

export async function GET(req: Request) {
  const purchaseFlowId = new URL(req.url).searchParams.get('purchaseFlowId') as string;
  const checkoutData = await safelyGetItemFromCollection({
    itemId: purchaseFlowId,
    dataCollectionId: CHECKOUT_COLLECTION_ID,
  });

  return new Response(JSON.stringify(checkoutData ?? {}));
};

export async function POST(req: Request) {
  const { purchaseFlowId, shouldInsure } = await req.json();

  try {
    await upsertDataToCollection({
      dataCollectionId: CHECKOUT_COLLECTION_ID,
      item: {
        _id: purchaseFlowId,
        data: {
          shouldInsure,
        },
      },
    });

    // 
    return new Response('Success');
  } catch (error) {
    console.log(error)
    return new Response('Error')
  };
};
