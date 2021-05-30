import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react';

import InviteChannelModal from '@components/InviteChannelModal';
import useStore from '@hooks/useStore';
import { Header } from '@pages/Channel/styles';

const ChannelHeader = () => {
  const { UserData } = useStore();
  const { channel } = useParams<{ workspace: string; channel: string }>();

  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  return (
    <>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{UserData.channelUsers?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </>
  );
};

export default observer(ChannelHeader);
