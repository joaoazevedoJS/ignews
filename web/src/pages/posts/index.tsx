import { FC } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';

const Posts: FC = () => {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="/">
            <time>18 de maio de 2021</time>

            <strong>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </strong>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro ab
              atque laborum impedit voluptates pariatur modi labore minima
              repellat ea. Quam explicabo dolorum excepturi pariatur eum
              similique illo quibusdam non!
            </p>
          </a>

          <a href="/">
            <time>18 de maio de 2021</time>

            <strong>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </strong>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro ab
              atque laborum impedit voluptates pariatur modi labore minima
              repellat ea. Quam explicabo dolorum excepturi pariatur eum
              similique illo quibusdam non!
            </p>
          </a>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,
    },
  );

  console.log(response);

  return {
    props: {},
  };
};

export default Posts;
