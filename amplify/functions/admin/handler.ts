import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand, QueryCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });

interface AdminRequest {
  action: 'verify_admin' | 'generate_code' | 'update_game' | 'manual_score';
  adminCode?: string;
  gameId?: string;
  userId?: string;
  data?: any;
  year?: number;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: AdminRequest = JSON.parse(event.body || '{}');
    const { action } = body;

    switch (action) {
      case 'verify_admin':
        return await verifyAdminCode(body);
      case 'generate_code':
        return await generateAdminCode(body);
      case 'update_game':
        return await updateGameSettings(body);
      case 'manual_score':
        return await manualScoreUpdate(body);
      default:
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          },
          body: JSON.stringify({
            success: false,
            message: 'Invalid action'
          })
        };
    }

  } catch (error) {
    console.error('Admin function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: false,
        message: 'Admin operation failed'
      })
    };
  }
};

async function verifyAdminCode(body: AdminRequest) {
  const { adminCode } = body;
  
  // In a real implementation, you'd check against a database of valid admin codes
  // For now, we'll use a simple hardcoded check
  const validCodes = ['ADMIN2025', 'CHRISTMAS2025', 'FAMILY2025'];
  
  const isValid = validCodes.includes(adminCode || '');
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
    body: JSON.stringify({
      success: true,
      isValid,
      benefits: isValid ? ['Free game access', 'Admin privileges', 'Custom challenges'] : []
    })
  };
}

async function generateAdminCode(body: AdminRequest) {
  // Generate a new admin code (this would typically be done by a super admin)
  const newCode = `ADMIN${Date.now().toString().slice(-6)}`;
  
  // In a real implementation, you'd store this in the database
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
    body: JSON.stringify({
      success: true,
      adminCode: newCode,
      message: 'Admin code generated successfully'
    })
  };
}

async function updateGameSettings(body: AdminRequest) {
  const { gameId, data, year } = body;
  
  if (!gameId || !year) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: false,
        message: 'Game ID and year required'
      })
    };
  }

  const PK = `GAME#${year}#METADATA`;
  
  await dynamoDb.send(new UpdateItemCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: { S: PK },
      SK: { S: gameId }
    },
    UpdateExpression: 'SET game_settings = :settings',
    ExpressionAttributeValues: {
      ':settings': { S: JSON.stringify(data) }
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
      message: 'Game settings updated successfully'
    })
  };
}

async function manualScoreUpdate(body: AdminRequest) {
  const { gameId, userId, data, year } = body;
  
  if (!gameId || !userId || !year) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify({
        success: false,
        message: 'Game ID, user ID, and year required'
      })
    };
  }

  const PK = `GAME#${year}`;
  const SK = `USER#${userId}#${gameId}`;
  
  await dynamoDb.send(new UpdateItemCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      PK: { S: PK },
      SK: { S: SK }
    },
    UpdateExpression: 'SET bonus_points = :bonusPoints',
    ExpressionAttributeValues: {
      ':bonusPoints': { N: data.bonusPoints.toString() }
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
      message: 'Score updated successfully'
    })
  };
}
