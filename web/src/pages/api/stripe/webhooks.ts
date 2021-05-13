/* eslint-disable no-restricted-syntax */

import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import StripeLib from 'stripe';

import stripe from '../../../services/stripe';

import { Subscription } from '../_lib/Subscription';

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set(['checkout.session.completed']);

const webhooks = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method === 'POST') {
    const buff = await buffer(req);

    const secret = req.headers['stripe-signature'];

    let event: StripeLib.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buff,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      return res.status(400).send(`Webhook-error: ${error.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'checkout.session.completed':
            saveSubscription(event);

            break;
          default:
            throw new Error('Unhandled event.');
        }
      } catch {
        return res.json({ error: 'Webhook handler faild' });
      }
    }

    return res.json({ received: true });
  }

  res.setHeader('Allow', 'POST');

  return res.status(405).end('Method not allowed');
};

const saveSubscription = async (event: StripeLib.Event) => {
  const subscription = new Subscription();

  const checkoutSession = event.data.object as StripeLib.Checkout.Session;

  subscription.save({
    subscriptionID: checkoutSession.subscription.toString(),
    customerID: checkoutSession.customer.toString(),
  });
};

export default webhooks;
