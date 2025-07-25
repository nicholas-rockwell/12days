import { defineFunction } from '@aws-amplify/backend';

export const createGame = defineFunction({
  name: 'create-game',
  entry: './handler.ts',
  environment: {
    DYNAMODB_TABLE_NAME: 'GameData'
  }
});
