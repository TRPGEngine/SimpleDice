import io, { Socket } from 'socket.io-client';

const platformSocketParam = {
  jsonp: false,
};

const host =
  process.env.NODE_ENV === 'production' ? location.host : '127.0.0.1:9100';
const protocol = location.protocol === 'https:' ? 'wss' : 'ws';

export class API {
  serverUrl = `${protocol}://${host}`;
  socket: typeof Socket;
  handleEventError: any;
  roomUUID: string;

  constructor(roomUUID: string) {
    this.roomUUID = roomUUID;
    this.socket = io(this.serverUrl, platformSocketParam);
    this.joinRoom();
  }

  private joinRoom() {
    this.socket.emit('joinRoom', this.roomUUID);
  }

  sendMsg(senderName: string, msg: string) {
    this.socket.emit('sendMsg', this.roomUUID, senderName, msg);
  }
}
