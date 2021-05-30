import React, { createContext, useState } from 'react';
import Store from '@stores/index';

export const MobxContext = createContext<Store | null>(null);

export const MobxProvider = ({ children }: any) => {
  const [appStore] = useState(() => new Store());
  return <MobxContext.Provider value={appStore}>{children}</MobxContext.Provider>;
};
