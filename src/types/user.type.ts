type Role = 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  phoneNumber: {
    isoCode: string;
    countryCode: string;
    internationalNumber: string;
  };
  accountConfirmation: {
    status: boolean;
    token: string;
    code: string;
    timestamp: string | null;
  };
  passwordReset: {
    token: string | null;
    expiry: string | null;
    lastResetAt: string | null;
  };
  _id: string;
  name: string;
  emailAddress: string;
  timezone: string;
  password: string;
  profile_image: string;
  role: Role;
  lastLoginAt: string;
  consent: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
