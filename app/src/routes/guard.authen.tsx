import { useSelector } from 'react-redux';
import { IStates } from 'src/stores/root.reducer';
import authService from 'src/services/auth.service';
import { isLoginScreen } from 'src/services/utils';
import { useLocation } from 'react-router-dom';

function AuthGuard(props: any) {
  let { pathname } = useLocation();
  const { children } = props;
  const { token, position } = useSelector((state: IStates) => state.authenReducer);

  // Authen Only
  const isAuthen = authService.isValidToken(token);
  if (isAuthen === false) {
    if (isLoginScreen) {
      setTimeout(() => {
        window.location.href = `${window.location.origin}/admin/login`;
      }, 300);
    } else {
      window.location.href = `${process.env.REACT_APP_WEB_HOST}`;
    }
  }else{
    if(pathname !== '/admin/dashboard' && position === 2){
      window.location.href = `${window.location.origin}/admin/dashboard`;
    }
  }

  return children;
}

export default AuthGuard;
