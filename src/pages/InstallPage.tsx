// InstallPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Input from '../components/Input';
import styled from 'styled-components';
import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  DeferredPrompt,
  handleBeforeInstallPrompt,
  handleAppInstalled,
  handleInstallClick,
} from '../features/install/InstallPage'; // Ensure this path is correct

const First = styled.div`
  background-color: lightgray;
  padding: 20px;
  margin-top: 50px;
`;

const Logo = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  font-size: 24px;
  font-weight: bold;
  color: #000;
`;

const Welcome = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #000;
`;

const Second = styled.div`
  margin-top: 40px;
  text-align: center;
`;

const Note = styled.div`
  margin-top: 50px;
  text-align: center;
  font-size: 16px;
  color: #000;
`;

const InstallPage = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isInstallButtonClicked, setIsInstallButtonClicked] = useState(false);
console.log(showLogin);

  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPrompt | null>(
    null
  );

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) =>
      handleBeforeInstallPrompt(e, setDeferredPrompt, setShowInstallPrompt);

    const appInstalledHandler = () => handleAppInstalled(setShowInstallPrompt);

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        beforeInstallPromptHandler
      );
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleLogin = () => {
    navigate({ to: '/appointments' });
  };

  return (
    <>
      <First>
        <Logo>LOGO</Logo>
        <Welcome>Welcome</Welcome>
      </First>
      <Second>
        {showInstallPrompt && (
          <>
            <LoadingButton
              variant="outlined"
              loading={isInstallButtonClicked}
              loadingIndicator="Loading…"
              sx={{
                color: isInstallButtonClicked ? 'black' : 'white',
                backgroundColor: isInstallButtonClicked ? 'white' : 'black',
                width: '229px',
                height: '60px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '700',
                textAlign: 'center',
                font: 'Helvetica',
                ':hover': { backgroundColor: 'black', color: 'white' },
              }}
              onClick={() => {
                handleInstallClick(
                  deferredPrompt,
                  setShowInstallPrompt,
                  setShowLogin,
                  setDeferredPrompt,
                  setIsInstallButtonClicked
                );
                setIsInstallButtonClicked(true);
              }}
              size="large"
            >
              Install Now
            </LoadingButton>
            <Note>Note: To proceed please install first</Note>
          </>
        )}

        {!showInstallPrompt && (
          <>
            <Input label="key" placeholder="Enter the key" />
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                backgroundColor: '#5A9EEE',
                ':hover': { backgroundColor: '#5A9EEE', color: 'white' },
              }}
              onClick={handleLogin}
            >
              LOGIN
            </Button>
          </>
        )}
      </Second>
    </>
  );
};

export default InstallPage;
