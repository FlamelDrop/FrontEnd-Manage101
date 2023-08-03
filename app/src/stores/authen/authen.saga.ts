import { takeLatest, put } from 'redux-saga/effects';
import authService from 'src/services/auth.service';
import { IActionSaga } from 'src/services/action.saga';
import { AuthenAction } from './authen.action';
import { callPost, callGet } from 'src/services/call-api';
import { ActionReducer } from 'src/services/action.reducer';
import { GeneralAction } from '../general/general.action';
import { MenusAction } from '../menus/menus.action';
import { ActionSaga } from 'src/services/action.saga';
import jwtDecode from 'jwt-decode';

const host = `${process.env.REACT_APP_API_HOST}`;

function* authenLoginR(e: IActionSaga) {
  const { username, password } = e.payload;
  try {
    const { access_token, refresh_token } = yield callPost(`${host}/v1/token/`, {
      username: username,
      password: password,
    }) || {};

    const { position } = jwtDecode(access_token);
    yield put(ActionReducer({ type: AuthenAction.AUTHEN_LOGIN_S, payload: { access_token, refresh_token, position } }));
    yield put(ActionSaga({ type: MenusAction.MENUS_LIST_R, payload: `Bearer ${access_token}` }));

    authService.setAuthorization(access_token);

    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

function* authenLogoutR(e: IActionSaga) {
  try {
    authService.delAuthorization();

    // Clear reducer
    yield put(ActionReducer({ type: GeneralAction.GENERAL_RESET_INFO }));
    yield put(ActionReducer({ type: AuthenAction.AUTHEN_LOGOUT_S }));
    yield put(ActionReducer({ type: MenusAction.MENUS_RESET_S }));
    e.onSuccess();
  } catch (err) {
    e.onFailure(err);
  }
}

// Login with token
function* authenTokenR(e: IActionSaga) {
  const { token, isFromAuthen } = e.payload;
  try {
    if (isFromAuthen) {
      yield put(ActionReducer({ type: AuthenAction.AUTHEN_LOGIN_S, payload: { token } }));
    }
    //
    const userInfo:any[] = yield callGet(`${host}/api/v1/mobile/show/profile`);
    yield put(ActionReducer({ type: GeneralAction.GENERAL_TOKEN_S, payload: { userInfo } }));
    e.onSuccess(userInfo);
  } catch (err) {
    e.onFailure(err);
  }
}

export default [
  takeLatest(AuthenAction.AUTHEN_LOGIN_R, (e: IActionSaga) => authenLoginR(e)),
  takeLatest(AuthenAction.AUTHEN_LOGOUT_R, (e: IActionSaga) => authenLogoutR(e)),
  takeLatest(AuthenAction.AUTHEN_TOKEN_R, (e: IActionSaga) => authenTokenR(e)),
];
