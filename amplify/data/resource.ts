import { defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = `
  type GameUser @model @auth(rules: [{ allow: private }]) {
    id: ID!
    PK: String! @index(name: "byPK")
    SK: String! @index(name: "bySK") 
    user_id: String!
    nickname: String!
    nameplate_style: String
    points: Int
    bonus_points: Int
    rank: Int
    jinglebells: Int
    subscription_status: String
    challenge_status: AWSJSON
    submission_data: AWSJSON
    timestamps: AWSJSON
    cosmetics: AWSJSON
    game_settings: AWSJSON
    created_at: AWSDateTime
    updated_at: AWSDateTime
  }

  type ChallengeBank @model @auth(rules: [{ allow: private }]) {
    id: ID!
    challenge_type: String! @index(name: "byChallengeType")
    year: Int! @index(name: "byYear")
    day: Int
    title: String!
    description: String!
    challenge_data: AWSJSON
    difficulty: String
    auto_gradable: Boolean
    created_at: AWSDateTime
  }

  type GameMetadata @model @auth(rules: [{ allow: private }]) {
    id: ID!
    game_id: String! @index(name: "byGameId")
    year: Int! @index(name: "byYear")
    game_name: String!
    start_date: AWSDate!
    admin_mode: Boolean!
    admin_user_id: String
    invite_code: String! @index(name: "byInviteCode")
    participant_count: Int
    custom_challenges: AWSJSON
    game_settings: AWSJSON
    created_at: AWSDateTime
  }

  type AdminCode @model @auth(rules: [{ allow: private }]) {
    id: ID!
    code: String! @index(name: "byCode")
    year: Int!
    uses_remaining: Int
    created_by: String!
    created_at: AWSDateTime
  }
` as const;

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
