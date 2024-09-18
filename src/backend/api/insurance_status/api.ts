import { draftOrders } from "@wix/ecom";

export async function GET(req: Request) {
    const draftOrderId = new URL(req.url).searchParams.get('draftOrderId') as string;
    const response = await draftOrders.getDraftOrder(draftOrderId);
    const insuranceFeeExists = response.calculatedDraftOrder?.draftOrder?.additionalFees.find(fee => fee.additionalFee?.code === 'wix-insurance-fee') !== undefined;
    return new Response(JSON.stringify(insuranceFeeExists));
}