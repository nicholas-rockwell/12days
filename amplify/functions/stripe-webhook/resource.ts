import { defineFunction } from '@aws-amplify/backend';

export const stripeWebhook = defineFunction({
  name: 'stripe-webhook',
  entry: './handler.ts',
  environment: {
    DYNAMODB_TABLE_NAME: 'GameData',
    STRIPE_SECRET_KEY: 'stripe_secret_placeholder',
    STRIPE_WEBHOOK_SECRET: 'stripe_webhook_secret_placeholder'
  }
});
