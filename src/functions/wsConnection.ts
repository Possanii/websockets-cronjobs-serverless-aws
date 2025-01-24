import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { response } from '../utils/response';
import { ConnectController } from '../controllers/ConnectController';
import { DisconnectController } from '../controllers/DisconnectController';

type RouteKey = '$connect' | '$disconnect' | 'sendMessage';

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const routeKey = event.requestContext.routeKey as RouteKey;

  if (routeKey === '$connect') {
    await ConnectController.handler(event);
  }

  if (routeKey === '$disconnect') {
    await DisconnectController.handler(event);
  }

  return response(200);
}
