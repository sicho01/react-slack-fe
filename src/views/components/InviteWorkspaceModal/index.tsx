import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';

import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import useStore from '@hooks/useStore';
import { Button, Input, Label } from '@pages/signup/styles';
import { getData, postData } from '@utils/rest';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}
const InviteWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const { UserData } = useStore();
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const onInviteMember = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }

      try {
        const invite_result = await postData(`/api/workspaces/${workspace}/members`, {
          email: newMember,
        });
        if (invite_result) {
          const workspace_users = await getData(`/api/workspaces/${workspace}/members`);
          UserData.setWorkSpaceUsers(workspace_users);
        }
        setShowInviteWorkspaceModal(false);
        setNewMember('');
      } catch (error) {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      }
    },
    [workspace, newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default observer(InviteWorkspaceModal);
