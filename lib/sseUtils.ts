import { serverPusher } from './pusher';

export function emitUpdate(data: any) {
  serverPusher.trigger('news-updates', 'update', data);
}

