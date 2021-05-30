import React, { VFC, useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router';
import { observer } from 'mobx-react';

import useStore from '@hooks/useStore';
import useSocket from '@hooks/useSocket';
import { IChannel } from '@common/types';
import { getData } from '@utils/rest';

import WorkSpaceHeader from './header';
import WorkspaceBody from './body';

const Workspace: VFC = () => {
  const { UserData } = useStore();
  const { workspace } = useParams<{ workspace: string }>();
  const [channelData, setChannelData] = useState<IChannel[]>();
  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if (channelData && UserData.myData && socket) {
      socket.emit('login', { id: UserData.myData.id, channels: channelData.map((v) => v.id) });
    }
  }, [socket, channelData]);

  useEffect(() => {
    getData(`/api/workspaces/${workspace}/channels`).then((response) => {
      setChannelData(response);
    });
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);

  if (!UserData.myData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <WorkSpaceHeader />
      <WorkspaceBody />
    </div>
  );
};

export default observer(Workspace);
