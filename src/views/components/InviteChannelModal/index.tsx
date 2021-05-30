import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';

import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import useStore from '@hooks/useStore';
import { getData, postData } from '@utils/rest';
import { Button, Input, Label } from '@pages/signup/styles';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}
const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { UserData } = useStore();
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const onInviteMember = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      try {
        const invite_result = await postData(`/api/workspaces/${workspace}/channels/${channel}/members`, {
          email: newMember,
        });
        if (invite_result) {
          const channel_users = await getData(`/api/workspaces/${workspace}/channels/${channel}/members`);
          UserData.setChannelUsers(channel_users);
          setShowInviteChannelModal(false);
          setNewMember('');
        }
      } catch (error) {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      }
    },
    [newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>채널 멤버 초대</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default observer(InviteChannelModal);
