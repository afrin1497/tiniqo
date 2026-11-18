/**
 * Payment layer. The checkout page only calls `processPayment()`.
 * To go live, replace the body of `processPayment` with a real gateway call
 * (Razorpay or Stripe) — nothing else in the UI needs to change.
 */
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

export interface PaymentDetails {
  upiId?: string;
  card?: { number: string; name: string; expiry: string; cvv: string };
  bank?: string;
  wallet?: "gpay" | "phonepe" | "paytm";
}

export interface PaymentRequest {
  orderId: string;
  amount: number; // rupees
  method: PaymentMethod;
  details: PaymentDetails;
  customer: { name: string; email: string; phone: string };
}

export type PaymentResult =
  | { success: true; paymentId: string; method: PaymentMethod }
  | { success: false; error: string };

export async function processPayment(req: PaymentRequest): Promise<PaymentResult> {
  if (req.method === "cod") {
    // COD needs no online payment — the order is confirmed and paid on delivery.
    return { success: true, paymentId: `cod_${req.orderId}`, method: "cod" };
  }

  // TODO(payment-gateway): Replace this mock with a real gateway call.
  //   Razorpay: create an order on the server (createServerFn) with the secret key,
  //   open Razorpay Checkout with the returned order_id, then verify the
  //   signature on the server before confirming the order.
  //   Stripe: create a PaymentIntent on the server and confirm it with Stripe Elements.
  await new Promise((r) => setTimeout(r, 1200));
  return { success: true, paymentId: `mock_${Date.now().toString(36)}`, method: req.method };
}
