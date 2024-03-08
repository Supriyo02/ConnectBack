import Head from "next/head";
import Layout from "../components/layout";
import PostFormCard from "../components/postFormCard";
import PostCard from "../components/postcard";
import { useSession } from "@supabase/auth-helpers-react";
import LoginPage from "./login";

export default function Home() {
  const session = useSession();

  console.log(session);
  if(!session){
    return <LoginPage />
  }


  return (
    <div>
      <Head>
        <title>ConnectX</title>
        <meta name="description" content="Connecting the world with a new dimension" />
        <link rel="icon" href="/favicon.png" />
      </Head>


      <Layout>
        <PostFormCard />
        <PostCard />
      </Layout>
    </div>
  );
}
