import Head from "next/head";
import Layout from "../components/layout";
import PostFormCard from "../components/postFormCard";
import PostCard from "../components/postcard";

export default function Home() {
  return (
    <divy>
      <Head>
        <title>ConnectX</title>
        <meta name="description" content="Connecting the world with a new dimension" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Layout>
        <PostFormCard />
        <PostCard />
      </Layout>
    </divy>
  );
}
