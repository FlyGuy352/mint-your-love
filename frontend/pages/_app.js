import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '../styles/globals.css';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from '@web3uikit/core';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.studio.thegraph.com/query/34130/lovetokengorliv7/0.0.4'
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Mint Your Love</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <NotificationProvider>
            <Navbar />
            <Component {...pageProps} />
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </>
  );
}

export default MyApp;