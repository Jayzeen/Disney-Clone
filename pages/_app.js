import '../styles/globals.css'
import Head from 'next/Head'

const MyApp = ({ Component, pageProps }) => {
  return <>
    <Head>
      <title>Disney Clone</title>
      <meta name="Jayzeen" content="Disney Clone"/>
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
