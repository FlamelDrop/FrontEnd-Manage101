import { useSelector } from 'react-redux';
import { IStates } from 'src/stores/root.reducer';
import authService from 'src/services/auth.service';

function GuestGuard(props: any) {
  const { children } = props;
  const { token } = useSelector((state: IStates) => state.authenReducer);
  const { list: menus } = useSelector((state: IStates) => state.menusReducer)

  // Guest Only
  const isAuthen = authService.isValidToken(token);
  if (isAuthen && menus.length > 0) {
    window.location.href = `${window.location.origin}/admin/dashboard`;
  }

  return children;
}

export default GuestGuard;
