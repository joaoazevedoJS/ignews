import { FC } from 'react';

import Head from 'next/head';

const Home: FC = () => {
  return (
    <>
      <Head>
        <title>Inicio | ig.news</title>
      </Head>

      <h1>
        Hello
        <span>World</span>
      </h1>
    </>
  );
};

export default Home;
