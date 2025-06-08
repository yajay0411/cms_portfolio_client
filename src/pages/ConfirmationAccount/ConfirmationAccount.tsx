import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import PATH from '@constants/path';
import useNavigation from '@hooks/useNavigation';
import AuthApiService from '@services/api/auth.api.service';

const ConfirmationAccount: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const { goTo, getQueryParam } = useNavigation();
  const code = getQueryParam('code');

  useEffect(() => {
    console.log(code);
    if (!token || !code) {
      console.error('Token or code is missing in the URL parameters.');
      return;
    }
    ConfirmationAccount();
  }, []);

  const ConfirmationAccount = async () => {
    try {
      const { success, message } = await AuthApiService.confirmationAccount(
        token as string,
        code as string
      );
      if (!success) {
        throw new Error(message);
      }
      goTo(PATH.login);
    } catch (error) {
      console.error('Error confirming account:', error);
    }
  };

  return <>Confirmation</>;
};

export default ConfirmationAccount;
