import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createGame } from './functions/create-game/resource';
import { joinGame } from './functions/join-game/resource';
import { submitChallenge } from './functions/submit-challenge/resource';
import { getGameData } from './functions/get-game-data/resource';
import { stripeWebhook } from './functions/stripe-webhook/resource';
import { adminFunctions } from './functions/admin/resource';

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
