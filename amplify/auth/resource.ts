import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    nickname: {
      mutable: true,
    },
    'custom:user_id': {
      dataType: 'String',
      mutable: false,
    },
    'custom:jinglebells': {
      dataType: 'Number',
      mutable: true,
    },
    'custom:is_admin': {
      dataType: 'Boolean',
      mutable: true,
    },
  },
  accountRecovery: 'EMAIL_ONLY',
});
