import { FC } from 'react';
import { GetStaticProps } from 'next';

import Head from 'next/head';

import styles from '../styles/pages/home.module.scss';
import SubscribeButton from '../components/SubscribeButton';
import stripe from '../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

const Home: FC<HomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome</span>

          <h1>
            News about
            <br />
            the
            <span> React </span>
            world.
          </h1>

          <p>
            Get acess to all the publications
            <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // retrieve é somente 1, onde ele busca pelo id do preço

  const price = await stripe.prices.retrieve('price_1IkQgwLE5ETj9Aye1mwRv1zc', {
    expand: ['product'],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100), // preço vem em centavos
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};

export default Home;
