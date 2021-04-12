import { FC } from 'react';

import styles from '../styles/home.module.scss';

const Home: FC = () => {
  return (
    <h1 className={styles.title}>
      Hello
      <span>World</span>
    </h1>
  );
};

export default Home;
