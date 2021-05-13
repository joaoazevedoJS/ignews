import Stripe from 'stripe';

export interface ISaveSubscription {
  subscriptionID: string;
  customerID: string;
}

export interface ISubscriptionData {
  id: string;
  userRef: object;
  status: Stripe.Subscription.Status;
  price_id: string;
}
