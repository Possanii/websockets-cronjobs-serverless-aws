import { GetConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { DeleteItemCommand, paginateScan } from '@aws-sdk/client-dynamodb';
import { apigwClient } from '../clients/apigwClient';
import { dynamoClient } from '../clients/dynamoClient';
import { env } from '../config/env';

export async function handler() {
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
        try {
          const postToConnectionCommand = new GetConnectionCommand({
            ConnectionId: item.connectionId.S,
          });

          await apigwClient.send(postToConnectionCommand);
        } catch {
          const deleteCommand = new DeleteItemCommand({
            TableName: env.CONNECTIONS_TABLE,
            Key: {
              connectionId: item.connectionId,
            },
          });

          await dynamoClient.send(deleteCommand);
        }
      })
    );
  }
}
