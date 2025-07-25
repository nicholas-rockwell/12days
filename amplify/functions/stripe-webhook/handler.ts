import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import Stripe from 'stripe';

const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-08-16' });

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const sig = event.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing signature or webhook secret' })
      };
    }

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body!, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid signature' })
      };
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      
      case 'invoice.payment_succeeded':
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        await handleSubscriptionPayment(invoice);
        break;
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' })
    };
  }
};

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { customer, metadata } = session;
  
  if (!metadata?.userId || !metadata?.gameId || !metadata?.year) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const { userId, gameId, year } = metadata;
  const PK = `GAME#${year}`;
  const SK = `USER#${userId}#${gameId}`;

  // Update user subscription status
  await dynamoDb.send(new UpdateItemCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: { S: PK },
      SK: { S: SK }
    },
    UpdateExpression: 'SET subscription_status = :status, stripe_customer_id = :customerId',
    ExpressionAttributeValues: {
      ':status': { S: 'active' },
      ':customerId': { S: customer as string }
    }
  }));

  console.log(`Updated subscription for user ${userId} in game ${gameId}`);
}

async function handleSubscriptionPayment(invoice: Stripe.Invoice) {
  // Handle recurring subscription payments
  console.log('Subscription payment succeeded:', invoice.id);
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  // Handle subscription updates or cancellations
  const status = subscription.status;
  console.log('Subscription status changed:', status);
}
