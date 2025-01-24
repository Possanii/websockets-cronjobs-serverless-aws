import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { env } from '../config/env';

export const apigwClient = new ApiGatewayManagementApiClient({
  endpoint: env.API_GW_ENDPOINT,
});
