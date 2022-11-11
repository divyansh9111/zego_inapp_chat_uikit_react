import React from "react";
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import LoginPage from "../Login/index";
import MainPage from "../Main/index";
import { initIMKitSDK, login, selectIsLoggedIn } from "../../store/authSlice";
import appConfig from "../../keyCenter";
import ZIMKitManager from "../../ZIMKit/src/components/ZIMKitCommon/VM/ZIMKitManager";
import { getCacheUserInfo } from '../../util/index';
import { generateToken } from '../../util/token';
import { ZIMKitUserInfoModel } from '../../ZIMKit/src/components/ZIMKitUser/Model';
class App extends React.Component<any, any> {
    cacheUserInfo = getCacheUserInfo() as ZIMKitUserInfoModel;
    componentDidMount() {
        // Init IMKitSDK
        const zimKit = new ZIMKitManager();
        zimKit.init(appConfig.appID).then(() => {
            this.props.initIMKitSDK(true);
            if (this.cacheUserInfo) {
                // Auto login
                const token = ZIMKitManager.getInstance().generateKitTokenForTest(appConfig.appID, appConfig.serverSecret, this.cacheUserInfo.userID);
                console.log('===token', token);
                zimKit.connectUser(this.cacheUserInfo,token).then(() => {
                    this.props.login();
                });
            }
        });
    }
    render() {
        return (
            <Routes>
                <Route path="/" element={ <MainPage /> } />
                <Route path="/main" element={ <MainPage /> } />
                <Route path="/login" element={ <LoginPage /> } />
            </Routes>
        );
    }
}

const mapDispatchToProps = (dispatch: (arg0: { payload: any; type: string; }) => any) => {
    return {
        initIMKitSDK: (content: any) => dispatch(initIMKitSDK(content)),
        login: (content: any) => dispatch(login(content))
    };
};

export default connect(selectIsLoggedIn, mapDispatchToProps)(App);
