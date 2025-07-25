import { defineFunction } from '@aws-amplify/backend';

export const joinGame = defineFunction({
  name: 'join-game',
  entry: './handler.ts',
  environment: {
    DYNAMODB_TABLE_NAME: 'GameData'
  }
});
