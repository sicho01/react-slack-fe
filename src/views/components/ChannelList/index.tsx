import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react';

import { CollapseButton } from '@components/DMList/styles';
import useStore from '@hooks/useStore';
import { getData } from '@utils/rest';
import { IChannel } from '@common/types';

const ChannelList: FC = () => {
  const { ChannelData } = useStore();
  const { workspace } = useParams<{ workspace?: string }>();
  const [channelCollapse, setChannelCollapse] = useState(false);

  useEffect(() => {
    if (!ChannelData.channelsData) {
      getData(`/api/workspaces/${workspace}/channels`).then((response: IChannel[]) => {
        ChannelData.setChannelsData(response);
      });
    }
  }, [ChannelData.channelsData]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          ChannelData.channelsData?.map((channel) => {
            return (
              <NavLink
                key={channel.name}
                activeClassName="selected"
                to={`/workspace/${workspace}/channel/${channel.name}`}
              >
                <span># {channel.name}</span>
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default observer(ChannelList);
