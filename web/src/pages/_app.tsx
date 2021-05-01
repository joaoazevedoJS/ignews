import { FC } from 'react';
import { AppProps } from 'next/app';
import { Provider } from '../hooks';

import Header from '../components/Header';

import '../styles/global.scss';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider session={pageProps.session}>
      <Header />

      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
