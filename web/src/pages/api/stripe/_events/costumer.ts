import Stripe from 'stripe';

import { Subscription } from '../../_lib/Subscription';

async function createdCustomerEvent(event: Stripe.Event): Promise<void> {
  const subscription = new Subscription();

  const subs = event.data.object as Stripe.Subscription;

  await subscription.save({
    customerID: subs.customer.toString(),
    subscriptionID: subs.id,
  });
}

async function updatedCustomerEvent(event: Stripe.Event): Promise<void> {
  const subscription = new Subscription();

  const subs = event.data.object as Stripe.Subscription;

  await subscription.update({
    customerID: subs.customer.toString(),
    subscriptionID: subs.id,
  });
}

export { createdCustomerEvent, updatedCustomerEvent };
