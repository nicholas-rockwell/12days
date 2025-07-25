# 🎄 12Days - Seasonal Challenge Web Application

A joyful, interactive group experience through 12 daily creative challenges. Built with Next.js, AWS Amplify, and a Christmas spirit!

## 🌟 Features Overview

### Core Functionality
- **Multi-Game Participation**: Users can join multiple game instances simultaneously
- **Daily Challenges**: 12 days of varied interactive challenges (Dec 13-24)
- **Admin & Participant Modes**: Create custom games or join existing ones
- **Stripe Integration**: Yearly subscriptions with free trial period
- **Cosmetic System**: Earn jinglebells, unlock presents with random cosmetics
- **Real-time Leaderboards**: Track progress across all participants

### Challenge Types
1. **Photo Upload**: Participation-based with community viewing
2. **Trivia**: Multiple choice/text answer questions
3. **Wordle**: 5-letter word guessing games
4. **Crossword**: Mini crossword puzzles
5. **Text Response**: Open-ended questions (admin-graded)
6. **Custom**: Extensible system for future challenge types

### User Experience
- **Catch-up Mode**: Late joiners get 6-hour window for previous days
- **Admin Dashboard**: Game statistics, custom challenge creation
- **Present Shop**: Spend jinglebells on animated cosmetic reveals
- **Profile Customization**: Nameplates, themes, and unlocked cosmetics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- Amplify CLI (`npm install -g @aws-amplify/cli`)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure AWS Amplify
```bash
# Initialize Amplify project
amplify init

# Follow prompts:
# - Project name: 12days
# - Environment: dev
# - Default editor: Visual Studio Code
# - App type: javascript
# - Framework: react
# - Source directory: src
# - Build command: npm run build
# - Start command: npm run start
# - Use profile: default (or your AWS profile)
```

### 3. Deploy Backend Resources
```bash
# Deploy authentication
amplify add auth
# Choose: Default configuration with Social Provider
# Add email for sign-in

# Deploy API and database
amplify add api
# Choose: GraphQL
# Use schema from amplify/data/resource.ts

# Deploy storage
amplify add storage
# Choose: Content (Images, audio, video, etc.)

# Push all resources to AWS
amplify push
```

### 4. Environment Variables
Create `.env.local` file in root directory:
```env
NEXT_PUBLIC_AWS_REGION=us-west-2
NEXT_PUBLIC_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your-user-pool-client-id
NEXT_PUBLIC_API_ENDPOINT=your-api-gateway-endpoint
NEXT_PUBLIC_STORAGE_BUCKET=your-s3-bucket-name

# Stripe Configuration (when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
12Days/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Home page with auth routing
│   │   ├── providers.tsx      # Amplify and context providers
│   │   └── globals.css        # Global styles with Christmas theme
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Main dashboard layout
│   │   ├── game/              # Game creation/selection
│   │   ├── navigation/        # Navigation bar
│   │   └── views/             # Main app views
│   └── contexts/
│       └── GameContext.tsx    # Global game state management
├── amplify/
│   ├── backend.ts             # Backend resource definitions
│   ├── auth/                  # Cognito configuration
│   ├── data/                  # DynamoDB schema
│   ├── storage/               # S3 configuration
│   └── functions/             # Lambda functions
│       ├── create-game/       # Game creation logic
│       ├── join-game/         # Game joining logic
│       ├── submit-challenge/  # Challenge submission
│       ├── get-game-data/     # Data retrieval
│       ├── stripe-webhook/    # Payment processing
│       └── admin/             # Admin functionality
└── package.json
```

## 🗄️ Database Schema

### DynamoDB Table: TwelveDays

**Primary Key Structure:**
- `PK`: `GAME#<year>` (e.g., `GAME#2025`)
- `SK`: `USER#<user_id>#<game_id>` (e.g., `USER#ALY#GAME_ABC123`)

**Item Types:**
1. **User Game Entries**: User participation in specific games
2. **Game Metadata**: Game settings and configuration (`PK#METADATA`)
3. **Challenge Bank**: Available challenges for each year
4. **Admin Codes**: Free access codes

**Key Attributes:**
```typescript
{
  user_id: string
  nickname: string
  nameplate_style: string
  points: number
  bonus_points: number
  rank: number
  jinglebells: number
  subscription_status: 'trial' | 'paid' | 'free_access' | 'pending_payment'
  challenge_status: Record<string, string>
  submission_data: Record<string, any>
  timestamps: Record<string, string>
  cosmetics: Record<string, any>
  game_settings?: any // For metadata items
  custom_challenges?: any[] // For admin games
}
```

## 🎮 Game Flow

### Creating a Game
1. User fills out game creation form
2. Chooses admin mode (custom challenges) or participant mode (default challenges)
3. If admin mode: Design all 12 days of challenges
4. System generates unique game ID and invite code
5. User redirected to Stripe checkout (if admin mode)
6. Game becomes available for others to join

### Joining a Game
1. User enters invite code or clicks invitation link
2. System validates game exists and user isn't already a member
3. Check game progress: if >4 days passed, require payment
4. Create user entry in database
5. If joined late: activate 6-hour catch-up window

### Daily Challenges
1. Each day unlocks based on game start date
2. Users see challenge prompt and submission interface
3. Submit text responses and/or media uploads
4. Automatic scoring for interactive challenges
5. Earn 50-125 jinglebells based on performance
6. View other participants' submissions (if allowed)

### Admin Features
1. Custom challenge creation during game setup
2. Real-time participant tracking and statistics
3. Manual scoring for text-response challenges
4. Generate free access codes for family/friends

## 💰 Monetization

### Stripe Integration
- **Yearly Subscription**: $X per year for unlimited game participation
- **Free Trial**: First 4 days free for all users
- **Admin Games**: Additional fee for creating custom games
- **Gift Purchases**: Buy access for multiple users
- **Free Access**: Admin-generated codes bypass payment

### Payment Flow
1. User triggers payment (game creation or day 5+ access)
2. Redirect to Stripe Checkout with game metadata
3. Webhook confirms payment and updates user status
4. User gains full access to current year's games

## 🎨 Cosmetic System

### Jinglebells Economy
- **Earning**: 50-125 per completed challenge
- **Bonuses**: Streaks, first login, Christmas Day special
- **Spending**: 100 jinglebells = 1 present

### Present System
- **Animation**: Christmas present opening sequence
- **Rarities**: Common, Uncommon, Rare, Legendary cosmetics
- **Categories**: Nameplates, themes, leaderboard styling, badges
- **Inventory**: All unlocked items stored in user profile

## 🔧 Development Phases

### Phase 1: Core System (Christmas 2025 Ready)
- [x] Project structure and basic components
- [ ] Cognito authentication integration
- [ ] Game creation and joining functionality
- [ ] Basic challenge system (text + media upload)
- [ ] DynamoDB integration with proper schema
- [ ] S3 media upload with pre-signed URLs
- [ ] Stripe payment integration
- [ ] All 5 main views functional

### Phase 2: Enhanced Features (Post-Christmas)
- [ ] Interactive challenge types (Wordle, Crossword)
- [ ] Advanced cosmetic system with animations
- [ ] Comprehensive admin analytics
- [ ] Social features and highlights curation
- [ ] Mobile app considerations

## 🚢 Deployment

### Amplify Hosting
```bash
# Deploy to production
amplify publish

# Custom domain setup
amplify add hosting
# Choose: Amplify Console
# Follow prompts for domain configuration
```

### Environment Management
```bash
# Create production environment
amplify env add prod

# Switch between environments
amplify env checkout dev
amplify env checkout prod
```

## 🔐 Security Considerations

- **Authentication**: Cognito with email verification
- **Authorization**: API Gateway with Cognito authorizer
- **Data Access**: IAM roles with least-privilege permissions
- **Media Upload**: Pre-signed S3 URLs with expiration
- **Admin Access**: Role-based permissions in user attributes
- **Payment Security**: Stripe handles all payment data

## 📊 Monitoring and Analytics

- **CloudWatch**: Lambda function logs and metrics
- **API Gateway**: Request/response logging
- **Cognito**: User authentication events
- **Custom Metrics**: Game participation, challenge completion rates

## 🎄 Christmas Theming

The application features extensive Christmas theming:
- **Colors**: Red, green, gold, and winter blues
- **Animations**: Snowfall, present opening, jinglebell bounce
- **Emojis**: Extensive use of Christmas and winter emojis
- **Seasonal Content**: All text and imagery Christmas-focused

## 🤝 Contributing

This is a personal family project, but contributions to improve the codebase are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for personal use. All rights reserved.

---

## 🎁 Next Steps

1. **Install dependencies**: `npm install`
2. **Set up AWS resources**: Follow Amplify setup guide above
3. **Configure environment**: Add your AWS resource IDs to `.env.local`
4. **Test locally**: `npm run dev`
5. **Deploy**: `amplify publish`

**Need help?** The project structure is designed to be modular and extensible. Each component includes detailed comments about its intended functionality.

**Ready for Christmas 2025!** 🎄🎮🎁
