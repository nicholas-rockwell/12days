"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const formFields = {
  signUp: {
    email: {
      order: 1,
      placeholder: 'Enter your email address',
      required: true,
    },
    password: {
      order: 2,
      placeholder: 'Create a password (min 8 characters)',
      required: true,
    },
    confirm_password: {
      order: 3,
      placeholder: 'Confirm your password',
      required: true,
    },
    nickname: {
      order: 4,
      placeholder: 'Choose your display name (e.g., "Mom", "Dad", "Sarah")',
      required: true,
      label: 'Nickname *',
    },
  },
}

export const AuthPage = () => {
  return (
    <div className="authPageContainer">
      {/* Snowflakes Animation */}
      <div className="snowflakes" aria-hidden="true">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <div className="authContentWrapper">
        <div className="authHeader">
          <h1 className="authTitle">Welcome to the 12 Days Christmas Challenge</h1>
          <p className="authSubtitle">Join the festive celebration and sign in!</p>
        </div>
        
        <Authenticator 
          formFields={formFields}
          signUpAttributes={['email', 'nickname']}
        />
      </div>
    </div>
  );
};
