import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, QueryCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });

interface GetGameDataRequest {
  gameId: string;
  userId: string;
  year: number;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { gameId, userId, year } = event.queryStringParameters || {};
    
    if (!gameId || !userId || !year) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
        body: JSON.stringify({
          success: false,
          message: 'Missing required parameters: gameId, userId, year'
        })
      };
    }

    const PK = `GAME#${year}`;
    
    // Get game metadata
    const gameMetadata = await dynamoDb.send(new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: `${PK}#METADATA` },
        SK: { S: gameId }
      }
    }));

    if (!gameMetadata.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
        body: JSON.stringify({
          success: false,
          message: 'Game not found'
        })
      };
    }

    // Get all participants in the game
    const participantsResponse = await dynamoDb.send(new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: PK },
        ':sk': { S: 'USER#' }
      }
    }));

    // Filter participants for this specific game
    const gameParticipants = participantsResponse.Items?.filter(item => 
      item.game_id?.S === gameId
    ) || [];

    // Sort by points for leaderboard
    const leaderboard = gameParticipants
      .map(item => ({
        userId: item.user_id?.S || '',
        nickname: item.nickname?.S || '',
        points: parseInt(item.points?.N || '0'),
        bonusPoints: parseInt(item.bonus_points?.N || '0'),
        jinglebells: parseInt(item.jinglebells?.N || '0'),
        nameplateStyle: item.nameplate_style?.S || 'default',
        challengeStatus: JSON.parse(item.challenge_status?.S || '{}'),
        subscriptionStatus: item.subscription_status?.S || 'trial',
        rank: 0 // Will be set below
      }))
      .sort((a, b) => (b.points + b.bonusPoints) - (a.points + a.bonusPoints));

    // Add rank
    leaderboard.forEach((participant, index) => {
      participant.rank = index + 1;
    });

    // Get current user's detailed data
    const currentUser = leaderboard.find(p => p.userId === userId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: true,
        gameData: {
          gameId,
          gameName: gameMetadata.Item.game_name?.S || '',
          startDate: gameMetadata.Item.start_date?.S || '',
          adminMode: gameMetadata.Item.admin_mode?.BOOL || false,
          participantCount: gameParticipants.length,
          customChallenges: JSON.parse(gameMetadata.Item.custom_challenges?.S || '[]')
        },
        leaderboard,
        currentUser,
        message: 'Game data retrieved successfully'
      })
    };

  } catch (error) {
    console.error('Error getting game data:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to get game data'
      })
    };
  }
};
