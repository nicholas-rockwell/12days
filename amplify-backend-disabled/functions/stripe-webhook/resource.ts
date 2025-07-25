import { defineFunction } from '@aws-amplify/backend';

export const stripeWebhookFunction = defineFunction({
  name: 'stripe-webhook',
  entry: './handler.ts'
});
