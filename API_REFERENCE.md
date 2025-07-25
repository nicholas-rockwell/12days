# 12Days API Endpoints & Lambda Functions

## Overview
All API endpoints are implemented as AWS Lambda functions and accessed through API Gateway with Cognito authentication.

## Authentication
All endpoints require a valid Cognito JWT token in the Authorization header:
```
Authorization: Bearer <cognito-jwt-token>
```

## Core Endpoints

### 1. Game Management

#### POST /api/createGame
**Lambda Function**: `create-game`
**Purpose**: Create a new game instance

**Request Body**:
```json
{
  "gameName": "Family Christmas 2025",
  "startDate": "2025-12-13",
  "adminMode": true,
  "customChallenges": [
    {
      "day": 1,
      "type": "trivia",
      "title": "Family History",
      "questions": [...]
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "gameId": "GAME_ABC123",
  "inviteCode": "XMAS2025",
  "requiresPayment": true,
  "stripeCheckoutUrl": "https://checkout.stripe.com/..."
}
```

#### POST /api/joinGame
**Lambda Function**: `join-game`
**Purpose**: Join an existing game via invite code

**Request Body**:
```json
{
  "inviteCode": "XMAS2025",
  "adminCode": "FAMILY_FREE_2025" // optional
}
```

**Response**:
```json
{
  "success": true,
  "gameId": "GAME_ABC123",
  "requiresPayment": false,
  "joinedLate": true,
  "catchUpWindow": 6
}
```

#### GET /api/gameData/{gameId}
**Lambda Function**: `get-game-data`
**Purpose**: Fetch game information and user's progress

**Response**:
```json
{
  "gameMetadata": {
    "gameId": "GAME_ABC123",
    "gameName": "Family Christmas 2025",
    "startDate": "2025-12-13",
    "adminMode": true,
    "participantCount": 8
  },
  "userProgress": {
    "challengeStatus": {
      "day_1": "completed",
      "day_2": "pending"
    },
    "points": 850,
    "rank": 3,
    "jinglebells": 1200
  },
  "currentChallenge": {
    "day": 2,
    "type": "photo",
    "title": "Share Your Christmas Tree",
    "description": "Take a photo of your Christmas tree..."
  }
}
```

### 2. Challenge System

#### POST /api/submitChallenge
**Lambda Function**: `submit-challenge`
**Purpose**: Submit a challenge response

**Request Body**:
```json
{
  "gameId": "GAME_ABC123",
  "day": 2,
  "challengeType": "photo",
  "textResponse": "Here's my beautiful tree!",
  "mediaUpload": {
    "filename": "tree.jpg",
    "contentType": "image/jpeg"
  }
}
```

**Response**:
```json
{
  "success": true,
  "score": 85,
  "jinglebellsEarned": 100,
  "presignedUploadUrl": "https://s3.amazonaws.com/...",
  "submissionId": "SUB_789"
}
```

#### GET /api/challengeBank/{year}/{day}
**Lambda Function**: `get-challenge-data`
**Purpose**: Get available challenges for a specific day

**Response**:
```json
{
  "challenges": [
    {
      "type": "trivia",
      "title": "Christmas Movies",
      "questions": [...],
      "difficulty": "medium"
    }
  ]
}
```

### 3. User Management

#### GET /api/userProfile
**Lambda Function**: `get-user-profile`
**Purpose**: Get user's profile and cross-game statistics

**Response**:
```json
{
  "userId": "USER123",
  "nickname": "Santa's Helper",
  "totalJinglebells": 2500,
  "cosmetics": {
    "nameplates": ["snowflake_rare", "christmas_tree"],
    "themes": ["winter_wonderland"],
    "equipped": {
      "nameplate": "snowflake_rare",
      "theme": "winter_wonderland"
    }
  },
  "gameStats": {
    "gamesJoined": 3,
    "totalChallengesCompleted": 24,
    "averageRank": 2.5
  }
}
```

#### PATCH /api/userProfile
**Lambda Function**: `update-user-profile`
**Purpose**: Update user profile settings

**Request Body**:
```json
{
  "nickname": "New Nickname",
  "nameplateStyle": "snowflake_rare",
  "theme": "winter_wonderland"
}
```

### 4. Shop & Cosmetics

#### POST /api/purchasePresent
**Lambda Function**: `purchase-present`
**Purpose**: Spend jinglebells to buy a present

**Request Body**:
```json
{
  "jinglebellsSpent": 100
}
```

**Response**:
```json
{
  "success": true,
  "cosmetic": {
    "id": "golden_frame_legendary",
    "name": "Golden Christmas Frame",
    "rarity": "legendary",
    "category": "nameplate",
    "isNew": true
  },
  "remainingJinglebells": 1500,
  "animationData": {
    "presentColor": "gold",
    "sparkleEffect": true
  }
}
```

### 5. Admin Functions

#### POST /api/admin/generateCode
**Lambda Function**: `admin-generate-code`
**Purpose**: Generate free access codes (admin only)

**Request Body**:
```json
{
  "codeDescription": "Family Access 2025",
  "maxUses": 20,
  "year": 2025
}
```

**Response**:
```json
{
  "success": true,
  "code": "FAMILY_XMAS_2025",
  "maxUses": 20,
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

#### GET /api/admin/gameStats/{gameId}
**Lambda Function**: `admin-game-stats`
**Purpose**: Get detailed game statistics (admin only)

**Response**:
```json
{
  "participants": [
    {
      "userId": "USER123",
      "nickname": "Player 1",
      "challengesCompleted": 8,
      "lastActivity": "2025-12-20T14:30:00Z",
      "totalPoints": 950
    }
  ],
  "dailyStats": {
    "day_1": {
      "completionRate": 0.75,
      "averageScore": 82
    }
  },
  "gameMetrics": {
    "totalSubmissions": 96,
    "averageCompletionTime": "12 minutes",
    "engagementScore": 0.85
  }
}
```

#### POST /api/admin/scoreTextResponse
**Lambda Function**: `admin-score-response`
**Purpose**: Manually score text responses (admin only)

**Request Body**:
```json
{
  "submissionId": "SUB_789",
  "score": 85,
  "feedback": "Great response!",
  "jinglebellsAwarded": 110
}
```

### 6. Payment & Subscriptions

#### POST /api/createCheckoutSession
**Lambda Function**: `create-checkout-session`
**Purpose**: Create Stripe checkout session

**Request Body**:
```json
{
  "productType": "yearly_subscription", // or "admin_game"
  "gameId": "GAME_ABC123",
  "successUrl": "https://12days.app/success",
  "cancelUrl": "https://12days.app/cancel"
}
```

**Response**:
```json
{
  "checkoutUrl": "https://checkout.stripe.com/pay/...",
  "sessionId": "cs_test_..."
}
```

#### POST /api/stripeWebhook
**Lambda Function**: `stripe-webhook`
**Purpose**: Handle Stripe payment confirmations

**Request Body**: Stripe webhook payload
**Response**: HTTP 200 for successful processing

### 7. Leaderboard & Social

#### GET /api/leaderboard/{gameId}
**Lambda Function**: `get-leaderboard`
**Purpose**: Get game leaderboard

**Query Parameters**:
- `sortBy`: points|completion|speed
- `limit`: number of results (default 50)

**Response**:
```json
{
  "leaderboard": [
    {
      "userId": "USER123",
      "nickname": "Top Player",
      "points": 1200,
      "rank": 1,
      "challengesCompleted": 12,
      "cosmetics": {
        "nameplate": "golden_crown",
        "effects": ["sparkle"]
      }
    }
  ],
  "userRank": 5,
  "totalParticipants": 25
}
```

#### GET /api/submissions/{gameId}/{day}
**Lambda Function**: `get-submissions`
**Purpose**: Get all submissions for a specific day (if allowed)

**Response**:
```json
{
  "submissions": [
    {
      "userId": "USER123",
      "nickname": "Player 1",
      "textResponse": "My answer",
      "mediaUrl": "https://s3.amazonaws.com/...",
      "submittedAt": "2025-12-13T15:30:00Z",
      "score": 85
    }
  ],
  "canView": true,
  "totalSubmissions": 8
}
```

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "details": {} // Optional additional details
}
```

Common error codes:
- `UNAUTHORIZED`: Invalid or missing auth token
- `FORBIDDEN`: User lacks permission for this action
- `NOT_FOUND`: Requested resource doesn't exist
- `VALIDATION_ERROR`: Invalid request data
- `PAYMENT_REQUIRED`: Action requires payment
- `GAME_FULL`: Game has reached participant limit
- `CHALLENGE_LOCKED`: Challenge not yet available

## Rate Limits

- General API calls: 100 requests per minute per user
- Challenge submissions: 1 per challenge per user
- Present purchases: 10 per minute per user
- Admin operations: 30 per minute per admin

## Development Notes

- All Lambda functions include comprehensive error handling
- Database operations use DynamoDB transactions where needed
- File uploads use pre-signed S3 URLs for security
- All user data is filtered by authentication context
- Admin operations validate admin status before execution
