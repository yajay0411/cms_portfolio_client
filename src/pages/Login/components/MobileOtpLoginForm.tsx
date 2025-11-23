import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import RHTextField from '@core/CustomFormInputs/RHTextField';
import { TEST_IDS } from '@constants/testIds';

import { yupResolver } from '@hookform/resolvers/yup';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { LoginSchema, MobileLoginSchemaYup, MobileOtpSchemaYup } from '@validations/auth.validation';
import { Button } from '@mui/material';

interface LoginFormProps {
  onRequestOtp: (mobile: string) => Promise<boolean | void>;
  onSubmit: ({ mobile, otp, provider }: LoginSchema) => void;
  isLoading: boolean;
}

const MobileOtpLoginForm: React.FC<LoginFormProps> = ({ onRequestOtp, onSubmit, isLoading }) => {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(0);

  const methods = useForm<any>({
    defaultValues: {
      mobile: '',
      otp: ''
    },
    resolver: yupResolver(MobileLoginSchemaYup)
  });

  const { handleSubmit, getValues, reset, setError, clearErrors } = methods;

  const onSubmitForm = async () => {
    const { mobile } = getValues();
    if (!isOTPSent) {
      const ok = await onRequestOtp(mobile);
      if (ok !== false) {
        setIsOTPSent(true);
        setTimer(60);
        setOtpDigits(['', '', '', '', '', '']);
      }
      return;
    }
    try {
      clearErrors('otp');
      const combinedOtp = otpDigits.join('');
      await MobileOtpSchemaYup.validate({ mobile, otp: combinedOtp }, { abortEarly: false });
    } catch (err: any) {
      const first = err?.errors?.[0] || 'Please enter a valid OTP';
      setError('otp', { type: 'manual', message: first });
      return;
    }
    onSubmit({ mobile, otp: otpDigits.join(''), provider: 'MOBILE' });
  };

  const handleReset = () => {
    setIsOTPSent(false);
    reset({ mobile: getValues('mobile') || '', otp: '' });
    setOtpDigits(['', '', '', '', '', '']);
    setTimer(0);
  };

  useEffect(() => {
    if (!isOTPSent || timer <= 0) return;
    const id = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isOTPSent, timer]);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) {
      const nextEl = document.getElementById(`otp-box-${index + 1}`) as HTMLInputElement | null;
      nextEl?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const next = [...otpDigits];
        next[index] = '';
        setOtpDigits(next);
      } else if (index > 0) {
        const prevEl = document.getElementById(`otp-box-${index - 1}`) as HTMLInputElement | null;
        prevEl?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      const prevEl = document.getElementById(`otp-box-${index - 1}`) as HTMLInputElement | null;
      prevEl?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      const nextEl = document.getElementById(`otp-box-${index + 1}`) as HTMLInputElement | null;
      nextEl?.focus();
    }
  };

  const handleOtpPaste: React.ClipboardEventHandler<any> = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setOtpDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    const el = document.getElementById(`otp-box-${focusIndex}`) as HTMLInputElement | null;
    el?.focus();
  };

  const handleResend = async () => {
    const mobile = getValues('mobile');
    if (!mobile) return;
    const ok = await onRequestOtp(mobile);
    if (ok !== false) {
      setTimer(60);
      setOtpDigits(['', '', '', '', '', '']);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Stack spacing={3}>
          <RHTextField
            variant="outlined"
            name="mobile"
            label="Mobile number"
            placeholder="Enter mobile number"
            fullWidth
            disabled={isOTPSent}
            icon={
              isOTPSent ? (
                <Tooltip
                  title="Edit mobile"
                  arrow>
                  <EditOutlinedIcon color={'primary'} />
                </Tooltip>
              ) : undefined
            }
            iconPosition="end"
            onIconClick={isOTPSent ? handleReset : undefined}
            testId={TEST_IDS.login.mobileInput}
          />
          {isOTPSent && (
            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between">
              {Array.from({ length: 6 }).map((_, idx) => (
                <TextField
                  key={idx}
                  id={`otp-box-${idx}`}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: 20, width: 40 }
                  }}
                  value={otpDigits[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={idx === 0 ? handleOtpPaste : undefined}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Stack>
          )}
        </Stack>
        <Tooltip
          title={isOTPSent ? 'Verify OTP' : 'Send OTP'}
          arrow>
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ mt: 4, fontWeight: 700 }}
            loading={isLoading}
            data-testid={TEST_IDS.login.loginButton}>
            {isOTPSent ? 'Verify OTP' : 'Send OTP'}
          </Button>
        </Tooltip>
        {isOTPSent && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 2 }}>
            {timer > 0 ? (
              <Typography
                variant="body2"
                color="text.secondary">
                Resend in 00:{String(timer).padStart(2, '0')}
              </Typography>
            ) : (
              <Button
                variant="text"
                color="secondary"
                onClick={handleResend}
                disabled={isLoading}>
                Resend OTP
              </Button>
            )}
          </Stack>
        )}
      </form>
    </FormProvider>
  );
};

export default MobileOtpLoginForm;
