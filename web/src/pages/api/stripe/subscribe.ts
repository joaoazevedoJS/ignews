import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { query } from 'faunadb';

import fauna from '../../../services/fauna';
import stripe from '../../../services/stripe';

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    const user = await fauna.query<User>(
      query.Get(
        query.Match(
          query.Index('USER_BY_EMAIL'),
          query.Casefold(session.user.email),
        ),
      ),
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCostomer = await stripe.customers.create({
        email: session.user.email,
      });

      await fauna.query(
        query.Update(query.Ref(query.Collection('USERS'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCostomer.id,
          },
        }),
      );

      customerId = stripeCostomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1IkQgwLE5ETj9Aye1mwRv1zc',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
};
