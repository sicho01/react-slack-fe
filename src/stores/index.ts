import ChannelData from './channelData';
import UserData from './userData';

class Store {
  private user_data = new UserData();
  private channel_data = new ChannelData();

  get UserData() {
    return this.user_data;
  }

  get ChannelData() {
    return this.channel_data;
  }
}

export default Store;
