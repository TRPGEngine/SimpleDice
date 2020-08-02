import React, { useEffect, useState, useCallback, useRef } from 'react';
import { NAME_KEY } from './const';
import { useHistory, useParams } from 'react-router';
import {
  makeStyles,
  Button,
  TextField,
  AppBar,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import SendIcon from '@material-ui/icons/Send';
import copy from 'copy-to-clipboard';
import { useSocketRoom } from './lib/useSocketRoom';
import { useLocalStorage } from 'react-use';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  appbar: {
    padding: 10,
    fontSize: 18,
  },
  msgList: {
    flex: 1,
    padding: 10,
    overflow: 'auto',
  },
  msgInput: {
    display: 'flex',
    padding: 10,
  },
  msgInputText: {
    flex: 1,
  },
});

const RoomTitle: React.FC<{
  memberCount: number;
  roomUUID: string;
}> = React.memo((props) => {
  const { roomUUID, memberCount } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleCopyRoomUUID = useCallback(() => {
    copy(roomUUID);
    setOpen(true);
  }, [roomUUID, setOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar
        className={classes.appbar}
        position="static"
        onClick={handleCopyRoomUUID}
      >
        <div>房间号(点击复制) 当前在线人数:{memberCount}</div>
        <div>{props.roomUUID}</div>
      </AppBar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <MuiAlert onClose={handleClose} severity="success">
          已经成功复制到剪切板!
        </MuiAlert>
      </Snackbar>
    </>
  );
});
RoomTitle.displayName = 'RoomTitle';

const MsgItem: React.FC<{
  senderName: string;
  msg: string;
  type?: string;
}> = React.memo((props) => {
  const { senderName, msg, type } = props;

  if (type === 'system') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            margin: 'auto',
            color: 'white',
            backgroundColor: '#c1c1c1',
            display: 'inline-block',
            padding: '2px 4px',
            borderRadius: 3,
          }}
        >
          {props.msg}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>{props.senderName}:</div>
      <div>{props.msg}</div>
    </div>
  );
});
MsgItem.displayName = 'MsgItem';

export const Room: React.FC = React.memo(() => {
  const [name] = useLocalStorage<string>(NAME_KEY);
  const classes = useStyles();
  const history = useHistory();
  const { roomUUID } = useParams<{ roomUUID: string }>();
  const [msg, setMsg] = useState('');

  const { memberCount, msgList, sendMsg } = useSocketRoom(roomUUID);

  const handleSendMsg = useCallback(() => {
    if (!msg) {
      // 不能发空消息
      return;
    }
    sendMsg(name, msg);
    setMsg('');
    console.log('发送消息', msg);
  }, [name, msg, setMsg, sendMsg]);

  useEffect(() => {
    if (!name) {
      history.replace('/');
    }
  });

  const msgListRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const el = msgListRef.current;
    el.scrollTo(0, el.scrollHeight - el.clientHeight);
  }, [msgList[msgList.length - 1]]);

  return (
    <div className={classes.root}>
      <RoomTitle memberCount={memberCount} roomUUID={roomUUID} />
      <div ref={msgListRef} className={classes.msgList}>
        {msgList.map((item, i) => (
          <MsgItem
            key={i}
            senderName={item.senderName}
            msg={item.msg}
            type={item.type}
          />
        ))}
      </div>
      <div className={classes.msgInput}>
        <TextField
          className={classes.msgInputText}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              handleSendMsg();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMsg}
        >
          Send
        </Button>
      </div>
    </div>
  );
});
Room.displayName = 'Room';
