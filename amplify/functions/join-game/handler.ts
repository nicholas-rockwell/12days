import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });

interface JoinGameRequest {
  inviteCode: string;
  userId: string;
  adminCode?: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: JoinGameRequest = JSON.parse(event.body || '{}');
    const { inviteCode, userId, adminCode } = body;

    // Check if admin code is provided and valid
    let isFreeAccess = false;
    if (adminCode) {
      const adminCodeQuery = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        IndexName: 'byCode',
        KeyConditionExpression: 'code = :code',
        ExpressionAttributeValues: {
          ':code': { S: adminCode }
        }
      };

      const adminCodeResult = await dynamoDb.send(new QueryCommand(adminCodeQuery));
      if (adminCodeResult.Items && adminCodeResult.Items.length > 0) {
        const code = adminCodeResult.Items[0];
        const usesRemaining = parseInt(code.uses_remaining?.N || '0');
        if (usesRemaining > 0) {
          isFreeAccess = true;
          // Decrement uses
          await dynamoDb.send(new UpdateItemCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: { id: code.id },
            UpdateExpression: 'SET uses_remaining = uses_remaining - :dec',
            ExpressionAttributeValues: {
              ':dec': { N: '1' }
            }
          }));
        }
      }
    }

    // Find game by invite code
    const gameQuery = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      IndexName: 'byInviteCode',
      KeyConditionExpression: 'invite_code = :code',
      ExpressionAttributeValues: {
        ':code': { S: inviteCode }
      }
    };

    const gameResult = await dynamoDb.send(new QueryCommand(gameQuery));
    if (!gameResult.Items || gameResult.Items.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid invite code'
        })
      };
    }

    const gameMetadata = gameResult.Items[0];
    const gameId = gameMetadata.game_id?.S || '';
    const year = parseInt(gameMetadata.year?.N || '0');
    const startDate = gameMetadata.start_date?.S || '';
    const PK = `GAME#${year}`;

    // Check if user is already in this game
    const existingUserQuery = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :userPrefix)',
      ExpressionAttributeValues: {
        ':pk': { S: PK },
        ':userPrefix': { S: `USER#${userId}#${gameId}` }
      }
    };

    const existingUser = await dynamoDb.send(new QueryCommand(existingUserQuery));
    if (existingUser.Items && existingUser.Items.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
        body: JSON.stringify({
          success: false,
          message: 'You are already a member of this game'
        })
      };
    }

    // Determine game progress and payment requirements
    const gameStartDate = new Date(startDate);
    const today = new Date();
    const daysPassed = Math.max(0, Math.floor((today.getTime() - gameStartDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    let subscriptionStatus = 'trial';
    let requiresPayment = false;

    if (isFreeAccess) {
      subscriptionStatus = 'free_access';
    } else if (daysPassed >= 4) {
      requiresPayment = true;
      subscriptionStatus = 'pending_payment';
    }

    // Create user entry
    const userEntry = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        PK: { S: PK },
        SK: { S: `USER#${userId}#${gameId}` },
        user_id: { S: userId },
        game_id: { S: gameId },
        nickname: { S: userId },
        nameplate_style: { S: 'default' },
        points: { N: '0' },
        bonus_points: { N: '0' },
        rank: { N: '0' },
        jinglebells: { N: isFreeAccess ? '100' : '0' }, // Bonus for free access
        subscription_status: { S: subscriptionStatus },
        challenge_status: { S: JSON.stringify({}) },
        submission_data: { S: JSON.stringify({}) },
        timestamps: { S: JSON.stringify({}) },
        cosmetics: { S: JSON.stringify({}) },
        joined_late: { BOOL: daysPassed > 0 },
        catch_up_window: { S: daysPassed > 0 ? new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() : '' },
        created_at: { S: new Date().toISOString() }
      }
    };

    await dynamoDb.send(new PutItemCommand(userEntry));

    // Update participant count
    await dynamoDb.send(new UpdateItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `${PK}#METADATA` },
        SK: { S: gameId }
      },
      UpdateExpression: 'SET participant_count = participant_count + :inc',
      ExpressionAttributeValues: {
        ':inc': { N: '1' }
      }
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: true,
        gameId,
        requiresPayment,
        joinedLate: daysPassed > 0,
        catchUpWindow: daysPassed > 0 ? 6 : 0, // hours
        message: 'Successfully joined game'
      })
    };

  } catch (error) {
    console.error('Error joining game:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to join game'
      })
    };
  }
};
