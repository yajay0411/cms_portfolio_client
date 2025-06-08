import { useAppContext } from '../contexts/app.context';
import PATH from '../constants/path';
import { User } from '../types/user.type';
import useNavigation from './useNavigation';
import { clearAllStorage, setInLS } from '../utils/browserStorage';
import { EStorageKey } from '../constants/storage_key';

const useAuth = () => {
  const { goTo } = useNavigation();
  const { setUser, setIsAuthenticated } = useAppContext();
  const onLogin = async (data: { user: User }) => {
    // More explicit type
    setUser(data.user);
    setIsAuthenticated(true);
    setInLS(EStorageKey.USER_KEY, data.user);
  };

  const onLogout = async () => {
    goTo(PATH.login);
    setUser(null);
    setIsAuthenticated(false);
    clearAllStorage();
  };

  return { onLogin, onLogout };
};

export default useAuth;
