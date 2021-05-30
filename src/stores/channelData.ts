import { observable, action } from 'mobx';
import { IChannel } from '@common/types';

class ChannelData {
  @observable channel_data: IChannel[] | undefined = undefined;
  @observable current_channel: IChannel | undefined = undefined;

  @action.bound
  setChannelsData(data: IChannel[] | undefined) {
    this.channel_data = data;
  }

  @action.bound
  setCurrentChannel(data: IChannel) {
    this.current_channel = data;
  }

  @action.bound
  addChannelData(data: IChannel) {
    this.channel_data?.push(data);
  }

  get currentChannel() {
    return this.current_channel;
  }

  get channelsData() {
    return this.channel_data;
  }
}
export default ChannelData;
