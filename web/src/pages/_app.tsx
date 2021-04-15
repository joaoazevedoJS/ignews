import { AppProps } from 'next/app';
import { FC } from 'react';

import Header from '../components/Header';

import '../styles/global.scss';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Header />

      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
