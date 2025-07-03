// javascript helper function to load stripe
import { loadStripe } from '@stripe/stripe-js';

let stripePromise: any;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;


// import { Stripe } from "@stripe/stripe-js";
// import { loadStripe } from "@stripe/stripe-js";


// let stripePromise: Promise<Stripe | null>;

// if(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined){
//     throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
// }


// const getStripe = (): Promise<Stripe | null> => {

//     if(!stripePromise){
//         stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
//     }
//     return stripePromise;
// };  

// export default getStripe;