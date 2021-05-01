import { FC, useCallback } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/client';

import styles from './styles.module.scss';

const SignInButton: FC = () => {
  const [session] = useSession();

  const handleSignIn = useCallback(() => {
    signIn('github');
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  return session ? (
    <button type="button" className={styles.signInButton}>
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" onClick={handleSignOut} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={handleSignIn}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
};

export default SignInButton;
