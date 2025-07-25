import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    nickname: {
      mutable: true,
      required: false,
    },
    'custom:user_id': {
      mutable: false,
      required: true,
    },
    'custom:jinglebells': {
      mutable: true,
      required: false,
    },
    'custom:is_admin': {
      mutable: true,
      required: false,
    },
  },
  accountRecovery: 'EMAIL_ONLY',
});
