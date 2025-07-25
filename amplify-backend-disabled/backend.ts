import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createGameFunction } from './functions/create-game/resource';
import { joinGameFunction } from './functions/join-game/resource';
import { submitChallengeFunction } from './functions/submit-challenge/resource';
import { getGameDataFunction } from './functions/get-game-data/resource';
import { stripeWebhookFunction } from './functions/stripe-webhook/resource';
import { adminFunctions } from './functions/admin/resource';

export const backend = defineBackend({
  auth,
  data,
  storage,
  createGameFunction,
  joinGameFunction,
  submitChallengeFunction,
  getGameDataFunction,
  stripeWebhookFunction,
  adminFunctions,
});
