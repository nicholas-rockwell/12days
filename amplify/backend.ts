import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import { createGame } from './functions/create-game/resource.js';
import { joinGame } from './functions/join-game/resource.js';
import { submitChallenge } from './functions/submit-challenge/resource.js';
import { getGameData } from './functions/get-game-data/resource.js';
import { stripeWebhook } from './functions/stripe-webhook/resource.js';
import { adminFunctions } from './functions/admin/resource.js';

export const backend = defineBackend({
  auth,
  data,
  storage,
  createGame,
  joinGame,
  submitChallenge,
  getGameData,
  stripeWebhook,
  adminFunctions,
});
