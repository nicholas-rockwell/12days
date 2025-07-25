import { defineFunction } from '@aws-amplify/backend';

export const adminFunctions = defineFunction({
  name: 'admin-functions',
  entry: './handler.ts',
  environment: {
    DYNAMODB_TABLE_NAME: 'GameData'
  }
});
