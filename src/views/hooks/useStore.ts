import React from 'react';
import { MobxContext } from '../../contexts/mobx';

const useStore = () => {
  const store = React.useContext(MobxContext);
  if (!store) {
    throw Error(`Cannot find mobx Context In Context Provider`);
  }
  return {
    UserData: store.UserData,
    ChannelData: store.ChannelData,
  };
};

export default useStore;
