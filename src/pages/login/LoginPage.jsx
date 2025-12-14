import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/useAuth';
import { GoogleLoginButton } from '../../components/Auth/GoogleLoginButton';
import { LoadingSpinner } from '../../components/Common/LoadingSpinner';
import { loginManager } from './loginManager';
import './LoginPage.css';

export const LoginPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const pageData = loginManager.getLoginPageData();

  // Redirecionar se já estiver logado
  useEffect(() => {
    loginManager.handleAuthCheck(user, isLoading, navigate);
  }, [user, isLoading, navigate]);

  if (loginManager.isPageLoading(isLoading)) {
    return <LoadingSpinner />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{pageData.appTitle}</h1>
          <p>{pageData.welcomeText}</p>
        </div>

        <div className="login-content">
          <p className="login-description">
            {pageData.loginDescription}
          </p>

          <GoogleLoginButton />
        </div>

        <div className="login-footer">
          <p className="terms-text">
            {pageData.termsText}{' '}
            <a href={pageData.termsLink}>{pageData.termsLabel}</a> e{' '}
            <a href={pageData.privacyLink}>{pageData.privacyLabel}</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
