import { defineFunction } from '@aws-amplify/backend';

export const joinGameFunction = defineFunction({
  name: 'join-game',
  entry: './handler.ts'
});
