import React from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import validateCheck from '@/lib/validate-check';
import { Link, useNavigate } from 'react-router';
import { useSignInWithPassword } from '@/hooks/auth/use-sign-in-with-password';
import { useHandleSaveEmail, useSaveEmail } from '@/store/session';
import { useOpenSignUpModal } from '@/store/sign-up-modal';
import toastMessage from '@/lib/toast-message';
import { AlertMessages } from '@/languages/alert-messages';
import { useLanguage } from '@/store/translation';
import { ContentMessages } from '@/languages/content-messages';
import { pressEnter } from '@/lib/input-value';

export default function SignInPage() {
  const navigate = useNavigate();
  const languages = useLanguage();

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const { isSavedEmail, savedEmail } = useSaveEmail();
  const { setSaveEmail, setRemoveEmail } = useHandleSaveEmail();
  const signUpModalOpen = useOpenSignUpModal();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [checked, setChecked] = React.useState(false);

  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
    useSignInWithPassword({
      onError: (error) => {
        console.error(error);
        const message = AlertMessages.LOGIN_FAILED[languages];
        toastMessage.error(message);

        setPassword('');
      },
      onSuccess: () => {
        if (checked) {
          setSaveEmail(email);
        } else {
          setRemoveEmail();
        }

        navigate('/');
      },
    });

  /**
   * 이메일 + 비밀번호 로그인
   * --
   * @returns
   */
  const handleLoginClick = () => {
    /** SECTION - 유효성 검사 시작 */
    // 이메일
    const inputEmail = email.trim();
    if (inputEmail === '') {
      toastMessage.info(AlertMessages.REQUIRED_EMAIL_INPUT[languages]);

      if (emailRef.current) emailRef.current.focus();

      return;
    }

    if (!validateCheck.email(inputEmail)) {
      toastMessage.info(AlertMessages.NOT_EMAIL_FORMAT[languages]);

      if (emailRef.current) emailRef.current.focus();

      return;
    }

    // 비밀번호
    const inputPassword = password.trim();
    if (inputPassword === '') {
      toastMessage.info(AlertMessages.REQUIRED_PASSWORD_INPUT[languages]);

      if (passwordRef.current) passwordRef.current.focus();

      return;
    }
    /**!SECTION - 유효성 검사 끝 */

    signInWithPassword({ email, password });
  };

  const handleSignUpClick = () => {
    signUpModalOpen();
  };

  React.useEffect(() => {
    if (isSavedEmail && savedEmail) {
      setChecked(isSavedEmail);
      setEmail(savedEmail);
    }
  }, [isSavedEmail, savedEmail]);

  const isPending = isSignInWithPasswordPending;

  return (
    <Card className={`w-full max-w-sm`}>
      <CardHeader>
        <CardTitle>{ContentMessages.LOGIN_TITLE[languages]}</CardTitle>
        <CardDescription>
          {ContentMessages.LOGIN_DESCRIPTION[languages]}
        </CardDescription>
        <CardAction>
          <Button
            variant={`link`}
            className={`hover:underline cursor-pointer`}
            onClick={handleSignUpClick}
          >
            {ContentMessages.SIGN_UP_BUTTON[languages]}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className={`flex flex-col gap-4`}>
        <div className={`flex flex-col gap-2`}>
          <div>
            <Label htmlFor={'email'}>
              {ContentMessages.EMAIL_LABEL[languages]}
            </Label>
          </div>
          <Input
            ref={emailRef}
            id={'email'}
            type={`email`}
            placeholder={ContentMessages.EMAIL_PLACEHOLDER[languages]}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => pressEnter(e, handleLoginClick)}
            disabled={isPending}
          />
        </div>
        <div className={`flex flex-col gap-2`}>
          <div>
            <Label htmlFor={'password'}>
              {ContentMessages.PASSWORD_LABEL[languages]}
            </Label>
          </div>
          <Input
            ref={passwordRef}
            id={'password'}
            type={`password`}
            placeholder={ContentMessages.PASSWORD_PLACEHOLDER[languages]}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => pressEnter(e, handleLoginClick)}
            disabled={isPending}
          />
        </div>
        <div className={`flex gap-2 items-center`}>
          <Checkbox
            id={`checkbox`}
            checked={checked}
            onCheckedChange={(e) => setChecked(e as boolean)}
            disabled={isPending}
            className={'cursor-pointer'}
          />
          <Label htmlFor={`checkbox`} className={'cursor-pointer'}>
            {ContentMessages.SAVE_EMAIL_CHECKBOX[languages]}
          </Label>
        </div>
        <Link
          to={`/forget-password`}
          className={`text-muted-foreground hover:underline text-sm`}
        >
          {ContentMessages.ANSER_FORGOT_PASSWORD[languages]}
        </Link>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full cursor-pointer`}
          onClick={handleLoginClick}
          disabled={isPending}
        >
          {ContentMessages.LOGIN_BUTTON[languages]}
        </Button>
      </CardFooter>
    </Card>
  );
}
