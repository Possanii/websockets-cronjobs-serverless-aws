import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { response } from '../utils/response';
import { paginateScan } from '@aws-sdk/client-dynamodb';
import { dynamoClient } from '../clients/dynamoClient';
import { env } from '../config/env';
import { PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { apigwClient } from '../clients/apigwClient';

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const { message } = JSON.parse(event.body || '{}');

  const paginator = paginateScan(
    {
      client: dynamoClient,
    },
    {
      TableName: env.CONNECTIONS_TABLE,
    }
  );

  for await (const { Items = [] } of paginator) {
    await Promise.allSettled(
      Items.map(async (item) => {
        const postToConnectionCommand = new PostToConnectionCommand({
          ConnectionId: item.connectionId.S,
          Data: JSON.stringify({
            message,
          }),
        });

        await apigwClient.send(postToConnectionCommand);
      })
    );
  }

  return response(204);
}
