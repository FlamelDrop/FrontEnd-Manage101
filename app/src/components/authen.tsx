import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { SplashScreen } from 'src/components';
import authService from 'src/services/auth.service';
import { ActionSaga } from 'src/services/action.saga';
import { AuthenAction } from 'src/stores/authen/authen.action';
import { IStates } from 'src/stores/root.reducer';
import Crypto from 'src/services/crypto';

const Authen = (propx: any) => {
  const { children } = propx;
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const { token: tokenStore } = useSelector((state: IStates) => state.authenReducer);

  useEffect(() => {
    const initAuth = async () => {
      const onLogout = () => {
        return dispatch(ActionSaga({ type: AuthenAction.AUTHEN_LOGOUT_R, payload: { force: true } }));
      };
      authService.setAxiosInterceptors({ onLogout });
      let token = tokenStore;
      const url = window.decodeURI(window.location.href);
      const isFromAuthen = url.startsWith(`${window.location.origin}/?i=`);
      if (isFromAuthen) {
        const tokenEncrypt = url.substring(url.indexOf('=') + 1);
        const tokenDecrypt = Crypto.decrypt(tokenEncrypt);
        token = tokenDecrypt;
      }
      if (authService.isValidToken(token)) {
        authService.setAuthorization(`${token}`);
        // dispatch(
        //   ActionSaga({
        //     type: AuthenAction.AUTHEN_TOKEN_R,
        //     payload: { token, isFromAuthen: true },
        //     onFailure: (err: any) => {
        //       onLogout();
        //     },
        //   }),
        // );
      }
      setLoading(false);
    };
    // initAuth();
  }, [dispatch, tokenStore]);

  if (isLoading) {
    // return <SplashScreen />;
  }
  return children;
};

export default Authen;
