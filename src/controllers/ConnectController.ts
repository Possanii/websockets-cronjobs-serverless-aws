import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { env } from '../config/env';
import { dynamoClient } from '../clients/dynamoClient';

export class ConnectController {
  static async handler(event: APIGatewayProxyWebsocketEventV2) {
    const { connectionId, connectedAt } = event.requestContext;

    const putItemCommand = new PutItemCommand({
      TableName: env.CONNECTIONS_TABLE,
      Item: {
        connectionId: { S: connectionId },
        connectedAt: { N: connectedAt.toString() },
      },
    });

    await dynamoClient.send(putItemCommand);
  }
}
