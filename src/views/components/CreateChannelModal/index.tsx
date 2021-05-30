import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react';

import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import useStore from '@hooks/useStore';
import { Button, Input, Label } from '@pages/signup/styles';
import { IChannel } from '@common/types';
import { postData } from '@utils/rest';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const { ChannelData } = useStore();
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const onCreateChannel = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const new_channel: IChannel = await postData(`/api/workspaces/${workspace}/channels`, {
          name: newChannel,
        });
        setShowCreateChannelModal(false);
        ChannelData.addChannelData(new_channel);
        setNewChannel('');
      } catch (error) {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      }
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default observer(CreateChannelModal);
