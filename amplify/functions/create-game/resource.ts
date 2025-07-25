import { defineFunction } from '@aws-amplify/backend';

export const createGameFunction = defineFunction({
  name: 'create-game',
  entry: './handler.ts'
});
