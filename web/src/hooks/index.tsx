import { FC } from 'react';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { Session } from 'next-auth';

interface ProviderProps {
  session?: Session;
}

const Provider: FC<ProviderProps> = ({ children, session }) => {
  return <NextAuthProvider session={session}>{children}</NextAuthProvider>;
};

export { Provider };
