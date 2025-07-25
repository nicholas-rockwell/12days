import { defineFunction } from '@aws-amplify/backend';

export const getGameDataFunction = defineFunction({
  name: 'get-game-data',
  entry: './handler.ts'
});
