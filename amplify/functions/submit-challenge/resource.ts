import { defineFunction } from '@aws-amplify/backend';

export const submitChallenge = defineFunction({
  name: 'submit-challenge',
  entry: './handler.ts',
  environment: {
    DYNAMODB_TABLE_NAME: 'GameData'
  }
});
