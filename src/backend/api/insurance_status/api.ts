import { checkout } from "@wix/ecom";

export async function GET(req: Request) {
    const checkoutId = new URL(req.url).searchParams.get('checkoutId') as string;
    const response = await checkout.getCheckout(checkoutId);
    const insuranceFeeExists = response.additionalFees.find(fee => fee.code === 'wix-insurance-fee') !== undefined;
    return new Response(JSON.stringify(insuranceFeeExists));
}