# Environment Variables
.env.local

# 12Days Web Application Environment Configuration

## Required Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### AWS Configuration
- `NEXT_PUBLIC_AWS_REGION`: Your AWS region (default: us-west-2)
- `NEXT_PUBLIC_USER_POOL_ID`: Cognito User Pool ID (get from Amplify)
- `NEXT_PUBLIC_USER_POOL_CLIENT_ID`: Cognito App Client ID
- `NEXT_PUBLIC_API_ENDPOINT`: API Gateway endpoint URL
- `NEXT_PUBLIC_STORAGE_BUCKET`: S3 bucket name for media uploads

### Stripe Configuration
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key (server-side only)
- `STRIPE_WEBHOOK_SECRET`: Webhook endpoint secret

### Database
- `DYNAMODB_TABLE_NAME`: Main DynamoDB table name (TwelveDays-{env})

## Getting These Values

1. **After running `amplify push`**, you'll get most AWS values
2. **Cognito values** are in AWS Console > Cognito > User Pools
3. **API endpoint** is in AWS Console > API Gateway
4. **S3 bucket** is in AWS Console > S3
5. **Stripe values** come from your Stripe dashboard

## Important Notes

- Never commit `.env.local` to version control
- Use different values for dev/staging/prod environments
- Stripe test keys start with `pk_test_` and `sk_test_`
- Production Stripe keys start with `pk_live_` and `sk_live_`
