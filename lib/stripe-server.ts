// stripe server side code

import Stripe from "stripe";

// Lazy singleton: the Stripe client is only built when first used at request
// time, so importing this module during the Next.js build never requires
// STRIPE_SECRET_KEY to be present.
let _stripe: Stripe | undefined;

function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
  _stripe = new Stripe(stripeSecretKey);
  return _stripe;
}

// Backwards-compatible default export: a lazy proxy so existing `stripe.xxx`
// call sites keep working without touching Stripe at import time.
const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default stripe;
