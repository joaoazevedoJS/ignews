import { query } from 'faunadb';

import fauna from '../../../../services/fauna';
import stripe from '../../../../services/stripe';

import { ISaveSubscription } from './dtos/ISubscription';

export class Subscription {
  public async save({
    customerID,
    subscriptionID,
  }: ISaveSubscription): Promise<void> {
    const userRef = await fauna.query(
      query.Select(
        'ref',
        query.Get(
          query.Match(query.Index('USER_BY_STRIPE_CUSTUMER_ID'), customerID),
        ),
      ),
    );

    const subscription = await stripe.subscriptions.retrieve(subscriptionID);

    const subscriptionData = {
      id: subscription.id,
      userRef,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
    };

    await fauna.query(
      query.Create(query.Collection('SUBSCRIPTION'), {
        data: subscriptionData,
      }),
    );
  }
}
