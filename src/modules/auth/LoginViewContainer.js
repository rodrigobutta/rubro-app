import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import LoginView from './LoginView';

import * as AuthStateActions from '../../redux/actions/AuthState';

export default connect(
  state => ({
    auth: state.auth
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      authStateActions: bindActionCreators(AuthStateActions, dispatch)
    };
  }
)(LoginView);
