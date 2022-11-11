import React from 'react';
import Common  from "../../ZIMKit/src/components/ZIMKitCommon/UI";
import { connect } from "react-redux";
import { logout, selectIsLoggedIn } from "../../store/authSlice";
import { Navigate } from 'react-router-dom';
import ZIMKitManager from '../../ZIMKit/src/components/ZIMKitCommon/VM/ZIMKitManager';
import { ZIMEventOfConnectionStateChangedResult, ZIMKitConversationType } from '../../ZIMKit/src/components/ZIMAdapter/index.entity';
import { clearCacheUserInfo } from '../../util';
import './style.css'
import ConversationList from '../../ZIMKit/src/components/ZIMKitConversation/UI';
import MessageView from "../../ZIMKit/src/components/ZIMKitChat/UI";
import GroupInfoView from "../../ZIMKit/src/components/ZIMKitGroup/UI";
import ZIMKitEventHandler from "../../ZIMKit/src/components/ZIMKitCommon/VM/ZIMKitEventHandler";
import { EventName } from "../../ZIMKit/src/components/ZIMKitCommon/Constant/event";
import ZIMKitGroupListVM from '../../ZIMKit/src/components/ZIMKitGroup/VM/ZIMKitGroupListVM'
import ZIMKitChatListVM from '../../ZIMKit/src/components/ZIMKitChat/VM/ZIMKitChatListVM';
class MainPage extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.showPeerChat = this.showPeerChat.bind(this);
        this.showGroupChat = this.showGroupChat.bind(this);
        this.createGroupChat = this.createGroupChat.bind(this);
    }
    componentDidMount(){
        ZIMKitManager.getInstance().on('connectionStateChanged', this.onConnectionStateChange());
        ZIMKitManager.getInstance().on('loggedStateChanged', this.onLogout());
        if (ZIMKitManager.getInstance().isLoggedIn) {
            // this.createGroupChat('group1313', ['aaavue']);
            // this.joinGroup('')
        }
    }
    componentWillUnmount(){
        ZIMKitManager.getInstance().off('connectionStateChanged', this.onConnectionStateChange());
        ZIMKitManager.getInstance().off('loggedStateChanged', this.onLogout());
    }
    onConnectionStateChange() {
        return (data: any) => {
          if ((data.state === 0 && data.event === 4) || (data.state === 0 && data.event === 0)) {
            this.props.logout();
            clearCacheUserInfo();
          }
        };
      }
    onLogout() {
        return (state: number) => {
          console.log('===login', state);
          if (!state) {
            this.props.logout();
            clearCacheUserInfo();
          }
        };
    }
    render() {
        return (<div id="main">
            {
                !this.props.isLoggedIn && (<Navigate to='/login' replace={ true } />)
            }
            <Common></Common> 
            {/* <ConversationList></ConversationList> */}
            {/* <MessageView></MessageView> */}
            {/* <GroupInfoView showGroupInfo={ true }></GroupInfoView> */}
        </div>);
    }
    showPeerChat() {
        const conversationID = 'web222'
        ZIMKitChatListVM.getInstance().initWithConversationID(conversationID, ZIMKitConversationType.ZIMKitConversationTypePeer);
    } 
    showGroupChat() {
        const conversationID = ''
        ZIMKitChatListVM.getInstance().initWithConversationID(conversationID, ZIMKitConversationType.ZIMKitConversationTypeGroup);
    }
    createGroupChat(groupName: string, userIDList: string[]) {
        ZIMKitManager.getInstance()
          .createGroup(groupName, userIDList)
          .then((data) => {
            console.log('===data', data);
            const { groupInfo, errorUserList } = data;
            const { baseInfo } = groupInfo;
            if (errorUserList.length) {
              // 群成员中有不存在的用户，可以根据业务逻辑处理，如弹窗提示等
            } else {
              // 创建群聊成功，直接进入群聊天页面
              const groupID = baseInfo.groupID;
              ZIMKitChatListVM.getInstance().initWithConversationID(groupID, ZIMKitConversationType.ZIMKitConversationTypeGroup);
            }
          })
          .catch((error) => {
            // 创建群聊失败，可根据 error 进行提示
            console.log('error', error);
          });
    }
    joinGroup(groupID: string) {
        ZIMKitManager.getInstance().joinGroup(groupID).then((data) => {
            ZIMKitChatListVM.getInstance().initWithConversationID(groupID, ZIMKitConversationType.ZIMKitConversationTypeGroup);
        })
    }
}

const mapDispatchToProps = (dispatch: (arg0: { payload: any; type: string; }) => any) => {
    return {
        logout: (content: any) => dispatch(logout(content))
    };
};
  
export default connect(selectIsLoggedIn, mapDispatchToProps)(MainPage);