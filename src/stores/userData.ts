import { observable, action } from 'mobx';
import { IUser } from '@common/types';

class UserData {
  @observable private my_data: IUser | undefined = undefined;
  @observable private workspace_users: IUser[] | undefined = undefined;
  @observable private channel_users: IUser[] | undefined = undefined;

  @action.bound
  setMyData(data: IUser | undefined) {
    this.my_data = data;
  }

  @action.bound
  setWorkSpaceUsers(data: IUser[] | undefined) {
    this.workspace_users = data;
    // this.users_data = { ...data};
  }

  @action.bound
  setChannelUsers(data: IUser[] | undefined) {
    this.channel_users = data;
    // this.users_data = { ...data};
  }

  get myData() {
    return this.my_data;
  }

  get workspaceUsers() {
    return this.workspace_users;
  }

  get channelUsers() {
    return this.channel_users;
  }

  getWorkSpaceUser(id: number | string) {
    const user_id: number = typeof id === 'string' ? +id : id;
    return this.workspace_users?.find((user) => user.id === user_id);
  }
}
export default UserData;
