import { useEffect, useRef, useState, useCallback } from 'react';
import { API } from './socket';
import { useList } from 'react-use';

interface MsgItem {
  senderName: string;
  msg: string;
  type?: string;
}
export function useSocketRoom(roomUUID: string) {
  const apiRef = useRef<API>();
  const [memberCount, setMemberCount] = useState(0);
  const [msgList, { push: pushMsg }] = useList<MsgItem>();

  useEffect(() => {
    const api = new API(roomUUID);
    apiRef.current = api;

    api.socket.on('updateMember', (count) => {
      console.log('[updateMember]', count);
      setMemberCount(count);
    });

    api.socket.on('sendMsg', ({ senderName, msg, type }) => {
      pushMsg({
        senderName,
        msg,
        type,
      });
    });

    return () => {
      api.socket.disconnect();
    };
  }, [roomUUID]);

  const sendMsg = useCallback((senderName: string, msg: string) => {
    apiRef.current.sendMsg(senderName, msg);
  }, []);

  return {
    apiRef,
    memberCount,
    msgList,
    sendMsg,
  };
}
