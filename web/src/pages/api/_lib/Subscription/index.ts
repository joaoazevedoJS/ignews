import { query } from 'faunadb';

import fauna from '../../../../services/fauna';
import stripe from '../../../../services/stripe';

import { ISaveSubscription, ISubscriptionData } from './dtos/ISubscription';

export class Subscription {
  private async getSubscriptionData({
    customerID,
    subscriptionID,
  }: ISaveSubscription): Promise<ISubscriptionData> {
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

    return subscriptionData;
  }

  public async save(data: ISaveSubscription): Promise<void> {
    const subscriptionData = await this.getSubscriptionData(data);

    await fauna.query(
      query.If(
        query.Not(
          query.Exists(
            query.Match(query.Index('SUBSCRIPTION_BY_ID'), data.subscriptionID),
          ),
        ),
        query.Create(query.Collection('SUBSCRIPTION'), {
          data: subscriptionData,
        }),
        query.Get(
          query.Match(query.Index('SUBSCRIPTION_BY_ID'), data.subscriptionID),
        ),
      ),
    );
  }

  public async update({
    customerID,
    subscriptionID,
  }: ISaveSubscription): Promise<void> {
    const subscriptionData = await this.getSubscriptionData({
      customerID,
      subscriptionID,
    });

    await fauna.query(
      query.Replace(
        query.Select(
          'ref',
          query.Get(
            query.Match(query.Index('SUBSCRIPTION_BY_ID'), subscriptionID),
          ),
        ),
        { data: subscriptionData },
      ),
    );
  }
}
