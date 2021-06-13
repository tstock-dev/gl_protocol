import React, { useState } from 'react';
import { AUTH_TOKEN } from '../constants';
import { useMutation, gql } from '@apollo/client';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signup(
      email: $email
      password: $password
      name: $name
    ) {
        id
        first_name
        last_name
        email
        token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $email: String!
    $password: String!
  ) {
    login(email: $email, password: $password) {
      id
      first_name
      last_name
      email
      token
    }
  }
`;

const Login = () => {
  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
    name: ''
  });


  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
        email: formState.email,
        password: formState.password
    },
    onCompleted: ({ login }) => {
        localStorage.setItem(AUTH_TOKEN, login.token);
        window.location.href = "/";
    }
  });
  
  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
        name: formState.name,
        email: formState.email,
        password: formState.password
    },
    onCompleted: ({ signup }) => {
        localStorage.setItem(AUTH_TOKEN, signup.token);
        window.location.href = "/";
    }
  });

  return (
    <>
        <div className="firstLineOfGrid-col1"></div>
        <div className="firstLineOfGrid-col2"></div>
        <div className="page-header-col1"></div>
        <div className="page-header">
            <h2>{formState.login ? 'Login' : 'Sign Up'}</h2>
        </div>

        <div className="table-col1"></div>

        <div className="flex flex-column">
            {!formState.login && (
                <input
                    value={formState.name}
                    onChange={(e) =>
                    setFormState({
                        ...formState,
                        name: e.target.value
                    })
                    }
                    type="text"
                    placeholder="Bitte Namen eintragen"
                />  
            )}
            <input
                value={formState.email}
                onChange={(e) =>
                    setFormState({
                    ...formState,
                    email: e.target.value
                    })
                }
                type="text"
                placeholder="Bitte Mail-Adresse eintragen"
            />
        </div>
        <div className="table-col1"></div>
        <div>
            <input
                value={formState.password}
                onChange={(e) =>
                    setFormState({
                    ...formState,
                    password: e.target.value
                    })
                }
                type="password"
                placeholder="Passwort eintragen"
            />
        </div>
        <div className="table-col1"></div>
        <div className="flex mt3">
            <button
                className="pointer mr2 button"
                onClick={formState.login ? login : signup}
            >
                {formState.login ? 'login' : 'create account'}
            </button>
        </div>
        <div className="table-col1"></div>
        <div className="flex mt3">
            <button
                className="pointer button"
                onClick={(e) =>
                    setFormState({
                    ...formState,
                    login: !formState.login
                    })
                }
            >
            {formState.login
                ? 'need to create an account?'
                : 'already have an account?'}
            </button>
        </div>
    </>
  );
};

export default Login;