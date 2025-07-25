import { defineFunction } from '@aws-amplify/backend';

export const submitChallengeFunction = defineFunction({
  name: 'submit-challenge',
  entry: './handler.ts'
});
