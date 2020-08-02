import io, { Socket } from 'socket.io-client';

const platformSocketParam = {
  jsonp: false,
};

export class API {
  port = 9100;
  serverUrl = `ws://127.0.0.1:${this.port}`;
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
