import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { env } from '../config/env';

export const apigwClient = new ApiGatewayManagementApiClient({
  endpoint: env.WEBSOCKET_API_URL,
});
