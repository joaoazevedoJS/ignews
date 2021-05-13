/* eslint-disable no-restricted-syntax */

import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import StripeLib from 'stripe';

import stripe from '../../../services/stripe';

import {
  checkoutEvent,
  createdCustomerEvent,
  updatedCustomerEvent,
} from './_events';

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

const isRelevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

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

    if (isRelevantEvents.has(event.type)) {
      try {
        relevantEvents(event);
      } catch {
        return res.json({ error: 'Webhook handler faild' });
      }
    }

    return res.json({ received: true });
  }

  res.setHeader('Allow', 'POST');

  return res.status(405).end('Method not allowed');
};

const callRelevantEvents = {
  'checkout.session.completed': checkoutEvent,
  'customer.subscription.created': createdCustomerEvent,
  'customer.subscription.updated': updatedCustomerEvent,
  'customer.subscription.deleted': updatedCustomerEvent,
};

const relevantEvents = async (event: StripeLib.Event) => {
  if (callRelevantEvents[event.type]) {
    return callRelevantEvents[event.type](event);
  }

  throw new Error('Unhandled event.');
};

export default webhooks;
