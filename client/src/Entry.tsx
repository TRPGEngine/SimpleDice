import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  makeStyles,
  Collapse,
  Link,
} from '@material-ui/core';

import { useHistory } from 'react-router';
import { useLocalStorage } from 'react-use';
import { v1 as createUUID } from 'uuid';
import { NAME_KEY } from './const';

const PowerBy = React.memo(() => {
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 20,
        textAlign: 'center',
      }}
    >
      Power By{' '}
      <Link href="https://trpgdoc.moonrailgun.com" target="_blank">
        TRPGEngine
      </Link>
    </div>
  );
});

const useStyles = makeStyles({
  root: {
    padding: '10px 20px',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 10,
    width: '100%',
  },
});

export const Entry: React.FC = React.memo(() => {
  const classes = useStyles();
  const [name, setName] = useLocalStorage(NAME_KEY, '');
  const [roomUUID, setRoomUUID] = useState('');
  const history = useHistory();

  const handleCreateRoom = useCallback(() => {
    history.push(`/room/${createUUID()}`);
  }, []);

  const handleJoinRoom = useCallback(() => {
    history.push(`/room/${roomUUID}`);
  }, [roomUUID]);

  return (
    <div className={classes.root}>
      <PowerBy />

      <TextField
        className={classes.section}
        label="你希望你的朋友们怎么称呼你？"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Collapse className={classes.section} in={!!name}>
        <Button
          className={classes.section}
          variant="contained"
          color="primary"
          size="large"
          disableElevation
          onClick={handleCreateRoom}
        >
          创建一个房间
        </Button>

        <div className={classes.section}>或</div>

        <div className={classes.section}>
          <p>加入一个房间</p>
          <TextField
            className={classes.section}
            label="房间唯一标识"
            variant="outlined"
            value={roomUUID}
            onChange={(e) => setRoomUUID(e.target.value)}
          />
          <Collapse in={!!roomUUID}>
            <Button
              variant="contained"
              size="large"
              disableElevation
              onClick={handleJoinRoom}
            >
              加入房间
            </Button>
          </Collapse>
        </div>
      </Collapse>
    </div>
  );
});
Entry.displayName = 'Entry';
