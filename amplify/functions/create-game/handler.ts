import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { randomBytes } from 'crypto';

const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });

interface CreateGameRequest {
  gameName: string;
  startDate: string;
  adminMode: boolean;
  customChallenges?: any[];
  userId: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: CreateGameRequest = JSON.parse(event.body || '{}');
    const { gameName, startDate, adminMode, customChallenges, userId } = body;

    // Generate unique game ID and invite code
    const gameId = `GAME_${randomBytes(8).toString('hex').toUpperCase()}`;
    const inviteCode = randomBytes(6).toString('hex').toUpperCase();
    
    // Determine year from start date
    const year = new Date(startDate).getFullYear();
    const PK = `GAME#${year}`;
    
    // Create game metadata
    const gameMetadata = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        PK: { S: `${PK}#METADATA` },
        SK: { S: gameId },
        game_id: { S: gameId },
        year: { N: year.toString() },
        game_name: { S: gameName },
        start_date: { S: startDate },
        admin_mode: { BOOL: adminMode },
        admin_user_id: { S: userId },
        invite_code: { S: inviteCode },
        participant_count: { N: '1' },
        custom_challenges: { S: JSON.stringify(customChallenges || []) },
        game_settings: { S: JSON.stringify({}) },
        created_at: { S: new Date().toISOString() }
      }
    };

    // Create user entry in the game
    const userEntry = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        PK: { S: PK },
        SK: { S: `USER#${userId}#${gameId}` },
        user_id: { S: userId },
        game_id: { S: gameId },
        nickname: { S: userId }, // Will be updated from Cognito
        nameplate_style: { S: 'default' },
        points: { N: '0' },
        bonus_points: { N: '0' },
        rank: { N: '1' },
        jinglebells: { N: '0' },
        subscription_status: { S: adminMode ? 'pending_payment' : 'trial' },
        challenge_status: { S: JSON.stringify({}) },
        submission_data: { S: JSON.stringify({}) },
        timestamps: { S: JSON.stringify({}) },
        cosmetics: { S: JSON.stringify({}) },
        created_at: { S: new Date().toISOString() }
      }
    };

    // Save both items
    await dynamoDb.send(new PutItemCommand(gameMetadata));
    await dynamoDb.send(new PutItemCommand(userEntry));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: true,
        gameId,
        inviteCode,
        requiresPayment: adminMode,
        message: 'Game created successfully'
      })
    };

  } catch (error) {
    console.error('Error creating game:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to create game'
      })
    };
  }
};
