import { defineFunction } from '@aws-amplify/backend';

export const getGameData = defineFunction({
  name: 'get-game-data',
  entry: './handler.ts',
  environment: {
    DYNAMODB_TABLE_NAME: 'GameData'
  }
});
