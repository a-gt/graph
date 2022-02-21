import "../styles/globals.css";
import "../styles/font.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head></Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
