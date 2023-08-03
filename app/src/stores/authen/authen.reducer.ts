import { IActionReducer } from 'src/services/action.reducer';
import { AuthenAction } from './authen.action';

export interface IAuthenState {
  isLoggedIn: boolean;
  token: string | undefined;
  refresh_token: string | undefined;
  position: number | undefined;
}
const AuthenState = {
  isLoggedIn: false, // true : ล็อกอินแล้ว
  token: undefined, //  token ที่ได้จากการ login
  refresh_token: undefined, 
  position: undefined
} as IAuthenState;

export default (state = AuthenState, e: IActionReducer) => {
  switch (e.type) {
    case AuthenAction.AUTHEN_LOGIN_S: {
      const { access_token:token, refresh_token, position } = e.payload
      return { ...state, isLoggedIn: true, token, refresh_token, position };
    }

    case AuthenAction.AUTHEN_LOGOUT_S: {
      return { ...state, ...AuthenState };
    }

    default: {
      return state;
    }
  }
};
