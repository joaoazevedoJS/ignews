import { FC } from 'react';

import styles from './styles.module.scss';

const SubscribeButton: FC = () => {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
};

export default SubscribeButton;
