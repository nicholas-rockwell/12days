import { defineData, type ClientSchema, a } from '@aws-amplify/backend';

// Schema for the existing TwelveDays table - we'll use this as our main table
const schema = a.schema({
  // Main game user data - using your existing PK/SK structure
  TwelveDaysUser: a
    .model({
      // Using your proven PK/SK structure
      PK: a.string().required(), // "GAME#2024", "GAME#2025", etc.
      SK: a.string().required(), // "USER#ALY", "USER#NICK", etc.
      
      // Existing fields from your table
      user_id: a.string().required(),
      nickname: a.string().required(),
      points: a.integer().default(0),
      bonus_points: a.integer().default(0),
      rank: a.integer().default(0),
      nameplate_style: a.string().default("default"),
      
      // Existing complex fields
      challenge_status: a.json(),
      submission_data: a.json(),
      timestamps: a.json(),
      
      // New field you'll add manually to existing records
      cognito_email: a.string(), // Link to Cognito user email
      
      // New fields for enhanced features
      jinglebells: a.integer().default(0),
      cosmetics: a.json(),
      
      // Theme system support
      selected_theme: a.string().default("christmas"), // User's selected theme
      unlocked_themes: a.json(), // Array of theme IDs user has unlocked
      
      // Join tracking for late joiner system
      joined_at: a.datetime(), // When user joined this specific game
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .identifier(['PK', 'SK'])
    .authorization((allow) => [allow.owner()]),

  // Game metadata and configuration - NEW for theme system
  GameMetadata: a
    .model({
      // PK: "GAME#2024", "GAME#2025", etc. (matches the game year)
      PK: a.string().required(),
      // SK: "METADATA" (single metadata record per game)
      SK: a.string().required(),
      
      // Game basic info
      game_id: a.string().required(), // Unique game identifier
      game_name: a.string().required(), // Display name
      year: a.integer().required(),
      
      // Game timeline
      start_date: a.string().required(), // ISO date string
      end_date: a.string(), // Calculated end date (start_date + 12 days)
      
      // Admin and permissions
      admin_mode: a.boolean().default(false),
      admin_user_id: a.string(), // Who created/manages this game
      
      // Game access
      invite_code: a.string().required(), // Code for others to join
      participant_count: a.integer().default(0),
      max_participants: a.integer().default(50),
      
      // THEME SYSTEM SUPPORT
      theme_id: a.string().default("christmas"), // Current game theme
      theme_history: a.json(), // Array of theme changes with timestamps
      custom_theme_config: a.json(), // Optional custom theme overrides
      
      // Game settings
      allow_late_join: a.boolean().default(true),
      catch_up_hours: a.integer().default(6), // Hours late joiners can catch up
      late_penalty_percent: a.integer().default(0), // Penalty for late submissions
      
      // Challenge configuration
      daily_challenges: a.json(), // Array of 12 days with challenge assignments
      custom_content: a.json(), // Custom trivia questions, photo prompts, etc.
      
      // Game status
      game_status: a.string().default("setup"), // setup, active, completed, cancelled
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .identifier(['PK', 'SK'])
    .authorization((allow) => [allow.owner()]),

  // Challenge content table - separate for scalability and reusability
  ChallengeContent: a
    .model({
      // PK structure: "CHALLENGE_TYPE#trivia", "CHALLENGE_TYPE#wordle", etc.
      PK: a.string().required(),
      // SK structure: "QUESTION#001", "QUESTION#002", etc. or "WORDLE#001"
      SK: a.string().required(),
      
      // Challenge metadata
      challenge_type: a.string().required(), // "trivia", "wordle", "crossword", "custom"
      difficulty: a.string().default("medium"), // "easy", "medium", "hard"
      category: a.string(), // "christmas", "general", "family", etc.
      
      // Content fields (varies by challenge type)
      question: a.string(), // For trivia/questions
      answer_options: a.json(), // Array of possible answers for multiple choice
      correct_answer: a.string(), // Correct answer
      explanation: a.string(), // Optional explanation
      
      // For other challenge types
      word: a.string(), // For wordle
      clues: a.json(), // For crossword
      media_url: a.string(), // For photo challenges
      
      // Tracking and metadata
      times_used: a.integer().default(0), // Track usage for balancing
      created_by: a.string(), // Admin who created it
      active: a.boolean().default(true), // Enable/disable content
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .identifier(['PK', 'SK'])
    .authorization((allow) => [allow.owner()]),

  // Game instance questions - ensures all players get same questions per day
  GameQuestions: a
    .model({
      // PK: "GAME#2024", "GAME#2025", etc. (matches the game year)
      PK: a.string().required(),
      // SK: "DAY#01", "DAY#02", etc.
      SK: a.string().required(),
      
      // Challenge type and content for this day
      challenge_type: a.string().required(), // "trivia", "photo", "wordle", "riddle"
      
      // The selected questions/prompts for this game day
      trivia_questions: a.json(), // Array of question IDs for trivia days
      photo_prompt: a.string(), // Photo challenge prompt
      wordle_word: a.string(), // Single wordle word ID
      riddle_content: a.json(), // Riddle question and answer
      
      // Scoring configuration
      base_points: a.integer().default(50), // Base points for completion
      speed_bonus_max: a.integer().default(20), // Max bonus for speed
      jinglebells_reward: a.integer().default(10), // Base jingle bells
      
      // Metadata
      day_number: a.integer().required(),
      selected_at: a.datetime(), // When questions were selected
      unlock_time: a.datetime(), // When challenge unlocks (midnight local)
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .identifier(['PK', 'SK'])
    .authorization((allow) => [allow.owner()]),

  // Photo challenge submissions and admin ratings
  PhotoSubmissions: a
    .model({
      // PK: "GAME#2024", "GAME#2025", etc.
      PK: a.string().required(),
      // SK: "DAY#01#USER#ALY", "DAY#02#USER#MOM", etc.
      SK: a.string().required(),
      
      // Submission details
      user_id: a.string().required(),
      nickname: a.string().required(),
      day_number: a.integer().required(),
      
      // Photo content
      photo_url: a.string().required(), // S3 URL to uploaded photo
      submission_text: a.string(), // Optional user description
      submitted_at: a.datetime().required(),
      
      // Admin rating (1-10 scale)
      admin_rating: a.integer(), // Set by admin, determines points
      admin_feedback: a.string(), // Optional admin comment
      rated_by: a.string(), // Which admin rated it
      rated_at: a.datetime(),
      
      // Calculated scoring
      points_earned: a.integer().default(0),
      speed_bonus: a.integer().default(0),
      jinglebells_earned: a.integer().default(0),
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .identifier(['PK', 'SK'])
    .authorization((allow) => [allow.owner()]),

  // Present/cosmetic unlocks and transactions
  UserPresentHistory: a
    .model({
      // PK: User's cognito email or user_id
      PK: a.string().required(),
      // SK: "PRESENT#001", "PRESENT#002", etc. (unique transaction ID)
      SK: a.string().required(),
      
      // Transaction details
      cost_in_jinglebells: a.integer().required(),
      purchased_at: a.datetime().required(),
      
      // Unlocked cosmetic
      cosmetic_type: a.string().required(), // "background", "border", "hat", "nameplate"
      cosmetic_id: a.string().required(), // "santa_hat", "gold_border", etc.
      cosmetic_name: a.string().required(), // "Santa's Hat"
      rarity: a.string().required(), // "common", "rare", "epic", "legendary"
      
      // Animation played
      animation_shown: a.boolean().default(false),
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .identifier(['PK', 'SK'])
    .authorization((allow) => [allow.owner()]),

  // Track individual user's question history across all games
  UserQuestionHistory: a
    .model({
      // PK: User's cognito email or user_id
      PK: a.string().required(),
      // SK: "USED_QUESTIONS" (single record per user)
      SK: a.string().required(),
      
      // All questions this user has ever seen
      used_trivia_questions: a.json(), // Array of question IDs
      used_wordle_words: a.json(), // Array of wordle IDs
      used_bonus_challenges: a.json(), // Array of bonus challenge IDs
      
      // Stats for balancing
      total_questions_seen: a.integer().default(0),
      games_participated: a.json(), // Array of game years: ["2024", "2025"]
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .identifier(['PK', 'SK'])
    .authorization((allow) => [allow.owner()]),

  // Game-specific custom content created by admins
  GameCustomContent: a
    .model({
      // PK: "GAME#2024", "GAME#2025", etc. (ties to specific game instance)
      PK: a.string().required(),
      // SK: "CUSTOM#QUESTION#001", "CUSTOM#QUESTION#002", etc.
      SK: a.string().required(),
      
      // Challenge metadata
      challenge_type: a.string().required(), // "trivia", "wordle", "custom"
      difficulty: a.string().default("medium"),
      category: a.string().default("custom"), // Mark as custom content
      
      // Content fields (same structure as ChallengeContent)
      question: a.string().required(), // Admin-created question
      answer_options: a.json().required(), // Admin-provided options
      correct_answer: a.string().required(), // Admin-specified correct answer
      explanation: a.string(), // Optional explanation from admin
      
      // Admin tracking
      created_by_user_id: a.string().required(), // Which admin created this
      created_by_nickname: a.string(), // Admin's display name
      is_active: a.boolean().default(true), // Admin can disable questions
      
      // Usage tracking (within this game only)
      times_used_in_game: a.integer().default(0),
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .identifier(['PK', 'SK'])
    .authorization((allow) => [allow.owner()]),

  // Game admin permissions
  GameAdmins: a
    .model({
      // PK: "GAME#2024", "GAME#2025", etc.
      PK: a.string().required(),
      // SK: User's cognito email or user_id
      SK: a.string().required(),
      
      // Admin details
      user_id: a.string().required(),
      nickname: a.string().required(),
      cognito_email: a.string().required(),
      
      // Admin permissions
      can_create_questions: a.boolean().default(true),
      can_edit_questions: a.boolean().default(true),
      can_manage_game: a.boolean().default(true),
      
      // Admin stats
      questions_created: a.integer().default(0),
      
      granted_by: a.string(), // Who made them admin
      granted_at: a.datetime(),
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .identifier(['PK', 'SK'])
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
