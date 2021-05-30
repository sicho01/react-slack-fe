import React, { VFC, useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Redirect } from 'react-router';
import gravatar from 'gravatar';

import Menu from '@components/Menu';
import useStore from '@hooks/useStore';
import { postData } from '@utils/rest';
import { Header, LogOutButton, ProfileImg, ProfileModal, RightMenu } from '@layouts/Workspace/styles';

const WorkSpaceHeader: VFC = () => {
  const { UserData } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onLogout = useCallback(async () => {
    try {
      const response = await postData('/api/users/logout', null, {
        withCredentials: true,
      });
      UserData.setMyData(undefined);
    } catch (error) {
      console.dir('[Workspace] error ', error);
    }
  }, []);

  if (!UserData.myData) {
    return <Redirect to="/login" />;
  }

  return (
    <Header>
      <RightMenu>
        <span onClick={onClickUserProfile}>
          <ProfileImg
            src={gravatar.url(UserData.myData.email, { s: '28px', d: 'retro' })}
            alt={UserData.myData.nickname}
          />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
              <ProfileModal>
                <img
                  src={gravatar.url(UserData.myData.nickname, { s: '36px', d: 'retro' })}
                  alt={UserData.myData.nickname}
                />
                <div>
                  <span id="profile-name">{UserData.myData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
          )}
        </span>
      </RightMenu>
    </Header>
  );
};

export default observer(WorkSpaceHeader);
