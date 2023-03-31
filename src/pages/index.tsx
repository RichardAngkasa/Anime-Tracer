import Head from "next/head";
import HomeBase from "./homeBase";

export default function Home() {
  return (
    <>
      <Head>
        <title>Anime Trace</title>
        <meta
          name="anime search engine"
          content="Search your favorite anime by screenshot"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sLogo.png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441045476723324"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <HomeBase />
    </>
  );
}
