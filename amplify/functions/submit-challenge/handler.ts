import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });

interface SubmitChallengeRequest {
  gameId: string;
  userId: string;
  day: number;
  challengeType: 'photo' | 'trivia' | 'text';
  submission: any;
  year: number;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: SubmitChallengeRequest = JSON.parse(event.body || '{}');
    const { gameId, userId, day, challengeType, submission, year } = body;

    const PK = `GAME#${year}`;
    const SK = `USER#${userId}#${gameId}`;

    // Get current user data
    const getUserResponse = await dynamoDb.send(new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: PK },
        SK: { S: SK }
      }
    }));

    if (!getUserResponse.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
        body: JSON.stringify({
          success: false,
          message: 'User not found in game'
        })
      };
    }

    // Parse existing challenge status
    const challengeStatus = JSON.parse(getUserResponse.Item.challenge_status?.S || '{}');
    const submissionData = JSON.parse(getUserResponse.Item.submission_data?.S || '{}');
    const timestamps = JSON.parse(getUserResponse.Item.timestamps?.S || '{}');

    // Update challenge status
    challengeStatus[`day${day}`] = 'completed';
    submissionData[`day${day}`] = {
      type: challengeType,
      content: submission,
      submittedAt: new Date().toISOString()
    };
    timestamps[`day${day}_submitted`] = new Date().toISOString();

    // Calculate points (base 10 points per challenge)
    const currentPoints = parseInt(getUserResponse.Item.points?.N || '0');
    const newPoints = currentPoints + 10;

    // Update user record
    await dynamoDb.send(new UpdateItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        PK: { S: PK },
        SK: { S: SK }
      },
      UpdateExpression: 'SET challenge_status = :cs, submission_data = :sd, timestamps = :ts, points = :points',
      ExpressionAttributeValues: {
        ':cs': { S: JSON.stringify(challengeStatus) },
        ':sd': { S: JSON.stringify(submissionData) },
        ':ts': { S: JSON.stringify(timestamps) },
        ':points': { N: newPoints.toString() }
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
        pointsEarned: 10,
        totalPoints: newPoints,
        message: 'Challenge submission successful'
      })
    };

  } catch (error) {
    console.error('Error submitting challenge:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to submit challenge'
      })
    };
  }
};
