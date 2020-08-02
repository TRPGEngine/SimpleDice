import IO from 'socket.io';
import { processDiceCommand } from './dice';
const app = require('express')();
const http = require('http').createServer(app);
const io = IO(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  function getRoomMemberCount(roomUUID: string): number {
    const count = Object.keys(io.in(roomUUID).sockets).length;
    return count;
  }

  console.log(`${socket.id} 已连接`);
  socket.on('joinRoom', (roomUUID: string) => {
    console.log(`${socket.id} 加入房间 [${roomUUID}]`);
    socket.join(roomUUID);

    io.to(roomUUID).emit('updateMember', getRoomMemberCount(roomUUID));
  });

  socket.on('sendMsg', (roomUUID: string, senderName: string, msg: string) => {
    console.log(`${socket.id}(${senderName}) 在房间 [${roomUUID}]: ${msg}`);
    io.to(roomUUID).emit('sendMsg', { senderName, msg });

    processDiceCommand(msg, (diceRes) => {
      io.to(roomUUID).emit('sendMsg', {
        senderName: '系统',
        msg: senderName + ' 发起投骰: ' + diceRes,
        type: 'system',
      });
    });
  });

  socket.on('disconnecting', () => {
    Object.keys(socket.rooms).forEach((roomUUID) => {
      io.to(roomUUID).emit('updateMember', getRoomMemberCount(roomUUID) - 1);
    });
  });
});

const port = 9100;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
