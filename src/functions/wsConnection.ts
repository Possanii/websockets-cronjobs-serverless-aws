import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { response } from '../utils/response';

let connections: string[] = [];

type RouteKey = '$connect' | '$disconnect' | 'sendMessage';

export async function handler(event: APIGatewayProxyWebsocketEventV2) {
  const routeKey = event.requestContext.routeKey as RouteKey;
  const { connectionId } = event.requestContext;

  if (routeKey === '$connect') {
    connections.push(connectionId);
  }

  if (routeKey === '$disconnect') {
    connections = connections.filter((id) => id !== connectionId);
  }

  if (routeKey === 'sendMessage') {
    console.log('Sending message to all connections');
  }

  return response(200);
}
