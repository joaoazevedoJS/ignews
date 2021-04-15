import { FC, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

const SignInButton: FC = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  return isUserLoggedIn ? (
    <button type="button" className={styles.signInButton}>
      <FaGithub color="#04d361" />
      João Azevedo
      <FiX color="#737380" />
    </button>
  ) : (
    <button type="button" className={styles.signInButton}>
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
};

export default SignInButton;
