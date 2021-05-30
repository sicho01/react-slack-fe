import React, { useCallback, useEffect, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useParams } from 'react-router';
import { observer } from 'mobx-react';
import { useSWRInfinite } from 'swr';

import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import useStore from '@hooks/useStore';
import { Container } from '@pages/Channel/styles';
import { IChat } from '@common/types';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import { getData, postData } from '@utils/rest';
import ChannelHeader from './header';

const Channel = () => {
  const { UserData, ChannelData } = useStore();
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );

  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);

  useEffect(() => {
    if (!ChannelData.currentChannel) {
      getData(`/api/workspaces/${workspace}/channels/${channel}`).then((response) => {
        ChannelData.setCurrentChannel(response);
      });
    }
  }, []);

  // 0초 A: 안녕~(optimistic UI)
  // 1초 B: 안녕~
  // 2초 A: 안녕~(실제 서버)
  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData && ChannelData.currentChannel) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: UserData.myData!.id,
            User: UserData.myData!,
            ChannelId: ChannelData.currentChannel!.id,
            Channel: ChannelData.currentChannel!,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });

        try {
          await postData(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
          });
          revalidate();
        } catch (error) {
          console.log('[Channel] error: ', error.response);
        }
      }
    },
    [chat, chatData, workspace, channel],
  );

  const onMessage = useCallback(
    (data: IChat) => {
      // id는 상대방 아이디
      if (
        data.Channel.name === channel &&
        (data.content.startsWith('uploads\\') || data.UserId !== UserData.myData?.id)
      ) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 50);
            }
          }
        });
      }
    },
    [channel],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 500);
    }
  }, [chatData]);

  if (!UserData.myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      <ChannelHeader />
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default observer(Channel);
