import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createGame } from './functions/create-game/resource';
import { joinGame } from './functions/join-game/resource';
import { submitChallenge } from './functions/submit-challenge/resource';
import { getGameData } from './functions/get-game-data/resource';

export const backend = defineBackend({
  auth,
  data,
  createGame,
  joinGame,
  submitChallenge,
  getGameData,
});
