import React, { FormEvent } from 'react';
import { connect } from 'react-redux';
import { login, selectIsLoggedIn } from '../../store/authSlice';
import { addCacheUserToList, getUserName, setCacheUserInfo, getAvatar } from '../../util';
import { generateToken } from '../../util/token';
import appConfig from '../../keyCenter';
import ZIMKitManager from '../../ZIMKit/src/components/ZIMKitCommon/VM/ZIMKitManager';
import './style.css';
import { Navigate } from 'react-router-dom';
import { ZIMError } from '../../ZIMKit/src/components/ZIMAdapter/index.entity';
import ZIMKiti18n from '../../ZIMKit/src/plugin/i18n';
const i18n = ZIMKiti18n.getInstance().getI18next() as any;

class LoginPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { userID: '', userName: '', loginDisabled: true, loading: false, errTip: false };
    this.handleUserIdChange = this.handleUserIdChange.bind(this);
    this.loginFun = this.loginFun.bind(this);
  }
  componentDidMount(): void {
    this.setState({ userName: getUserName('').userName });
  }
  handleUserIdChange(event: FormEvent) {
    const userID = (event.target as HTMLInputElement).value;
    this.setState({
      userID
    })
    if (userID.length) {
      this.setState({ userName: getUserName(userID).userName });
      if (userID.length < 6 || userID.length > 12) {
        this.setState({
          errTip: true,
          loginDisabled: true,
        })
      } else {
        this.setState({
          errTip: false,
          loginDisabled: false,
        })
      }
    } else {
      this.setState({
        errTip: false,
        loginDisabled: true,
      })
    }
  }
  loginFun() {
    if (appConfig.tokenURL) {
      // getToken(this.userID, appConfig).then((token) => {
      //   this.zimKitLogin(token);
      // });
    } else {
      const token = ZIMKitManager.getInstance().generateKitTokenForTest(appConfig.appID, appConfig.serverSecret, this.state.userID);
      this.zimKitLogin(token);
    }
  }
  zimKitLogin(token: string) {
    this.setState({
      loginDisabled: true,
      loading: true
    })
    const userInfo = {
      userID: this.state.userID,
      userName: this.state.userName,
      userAvatarUrl: getAvatar(this.state.userID),
    };
    ZIMKitManager.getInstance()
      .connectUser(userInfo, token)
      .then(() => {
        this.setState({
          loginDisabled: false,
          loading: false
        })
        setCacheUserInfo(userInfo);
        addCacheUserToList(userInfo);
        this.props.login();
      })
      .catch((err: ZIMError) => {
        console.log('kitlog login err', err);
        this.setState({ errTip: true, loginDisabled: true, loading: false});
      });
  }
  render() {
    return (
      <div id="login-con">
        <div id="login">
          {this.props.isLoggedIn && <Navigate to="/main" replace={true} />}
          <div className="login-box">
            <div className="welcome-box">
              <div className="welcome-text">{i18n.t('demo_welcome')}</div>
            </div>
            <div className={`form ${i18n.language === 'en' ? 'en-form' : null}`}>
              <div className="id">
                <div className="label">{i18n.t('demo_user_id_login')}</div>
                <input
                  className={i18n.language === 'en' ? 'en-input' : ''}
                  placeholder={i18n.t('demo_input_placeholder_w')}
                  onInput={this.handleUserIdChange}
                />
                <div
                  className="login-err-tip"
                  style={{
                    display: this.state.errTip ? 'block' : 'none'
                  }}>
                  {i18n.t('demo_input_user_id_error_tips')}
                </div>
              </div>
              <div className="name">
                <div className="label">{i18n.t('demo_user_name_w')}</div>
                <div id="userName">{this.state.userName}</div>
              </div>
              <button
                className="login-btn"
                onClick={this.loginFun}
                disabled={this.state.loginDisabled}>
                  {this.state.loading ? <div className="loading-icon"></div> : null}
                {i18n.t('demo_login')}
              </button>
            </div>
          </div>
        </div>
      </div>  
    );
  }
}

const mapDispatchToProps = (dispatch: (arg0: { payload: any; type: string; }) => any) => {
  return {
    login: (content: any) => dispatch(login(content))
  };
};

export default connect(selectIsLoggedIn, mapDispatchToProps)(LoginPage);
