import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'twelvedays-media-storage',
  access: (allow) => ({
    'media/{entity_id}/*': [
      allow.authenticated.to(['read', 'write']),
    ],
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write']),
    ],
  })
});
