import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { env } from '../config/env';
import { dynamoClient } from '../clients/dynamoClient';

export class DisconnectController {
  static async handler(event: APIGatewayProxyWebsocketEventV2) {
    const { connectionId } = event.requestContext;

    const deleteCommand = new DeleteItemCommand({
      TableName: env.CONNECTIONS_TABLE,
      Key: {
        connectionId: { S: connectionId },
      },
    });

    await dynamoClient.send(deleteCommand);
  }
}
