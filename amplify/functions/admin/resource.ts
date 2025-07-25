import { defineFunction } from '@aws-amplify/backend';

export const adminFunctions = defineFunction({
  name: 'admin-functions',
  entry: './handler.ts'
});
