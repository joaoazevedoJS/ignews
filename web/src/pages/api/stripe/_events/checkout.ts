import Stripe from 'stripe';

import { Subscription } from '../../_lib/Subscription';

async function checkoutEvent(event: Stripe.Event): Promise<void> {
  const subscription = new Subscription();

  const checkoutSession = event.data.object as Stripe.Checkout.Session;

  await subscription.save({
    subscriptionID: checkoutSession.subscription.toString(),
    customerID: checkoutSession.customer.toString(),
  });
}

export { checkoutEvent };
