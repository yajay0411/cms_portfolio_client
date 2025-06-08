import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/app.context';

function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppContext();

  const [history, setHistory] = useState<string[]>([]);
  const lastNavRef = useRef<number>(0); // timestamp tracker
  const debounceDelay = 400; // ms - can adjust if needed

  // Add to history only if pathname is new
  useEffect(() => {
    setHistory((prev) => {
      if (prev[prev.length - 1] !== location.pathname) {
        return [...prev, location.pathname];
      }
      return prev;
    });
  }, [location.pathname]);

  const canNavigate = () => {
    const now = Date.now();
    if (now - lastNavRef.current > debounceDelay) {
      lastNavRef.current = now;
      return true;
    }
    return false;
  };

  const goTo = (path: string, state?: any) => {
    if (!canNavigate() || path === location.pathname) return;
    const stateLoc = { location };
    navigate(path, { state: { stateLoc, ...state } });
  };

  const goBack = () => {
    if (!canNavigate()) return;
    navigate(-1);
  };

  const goForward = () => {
    if (!canNavigate()) return;
    navigate(1);
  };

  const replaceUrl = (path: string, state?: any) => {
    if (path === location.pathname) return;
    navigate(path, { replace: true, state });
  };

  const reloadPage = () => {
    if (!canNavigate()) return;
    navigate(0);
  };

  const getQueryParam = (key: string) => {
    const params = new URLSearchParams(location.search);
    return params.get(key);
  };

  const getPreviousRoute = () =>
    history.length > 1 ? history[history.length - 2] : '';

  const canGoBack = history.length > 1;
  const canGoForward =
    typeof window !== 'undefined' &&
    window.history.state?.idx < window.history.length - 1;

  return {
    currentPath: location.pathname,
    currentState: location.state,
    queryParams: new URLSearchParams(location.search),
    getQueryParam,
    history,
    goTo,
    goBack,
    goForward,
    replaceUrl,
    reloadPage,
    canGoBack,
    canGoForward,
    getPreviousRoute,
    user,
  };
}

export default useNavigation;
