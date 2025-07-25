import { defineData, type ClientSchema, a } from '@aws-amplify/backend';

// Using Amplify Data v2 schema builder syntax
const schema = a.schema({
  GameUser: a
    .model({
      user_id: a.string().required(),
      nickname: a.string().required(),
      points: a.integer().default(0),
      jinglebells: a.integer().default(0),
      rank: a.integer(),
      created_at: a.datetime(),
    })
    .authorization(allow => [allow.owner()]),
    
  Game: a
    .model({
      game_name: a.string().required(),
      start_date: a.date().required(),
      invite_code: a.string().required(),
      admin_user_id: a.string(),
      created_at: a.datetime(),
    })
    .authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
