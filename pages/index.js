import Head from "next/head";
import Layout from "../components/layout";
import PostFormCard from "../components/postFormCard";
import PostCard from "../components/postcard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import LoginPage from "./login";
import { useEffect, useState } from "react";
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en';
import { UserContext } from "../components/contexts/UserContext";

TimeAgo.addDefaultLocale(en);


export default function Home() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [posts, setPosts] = useState([]);
  const [profile,setProfile]= useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(()=>{
    if(!session?.user?.id){
      return;
    }
    supabase.from('profiles')
        .select()
        .eq('id', session.user.id)
        .then(result=>{
            if(result.data.length){
                setProfile(result.data[0]);
            }
        })
  },[session?.user?.id]);

  function fetchPosts(){
    supabase.from('posts')
    .select('id, content, created_at, photos, profiles(id, avatar, name)')
    .order('created_at', {ascending: false})
    .then(result=>{
      setPosts(result.data);
    })
  }

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
        <UserContext.Provider value={{profile}}>
        <PostFormCard onPost={fetchPosts} />
        {posts?.length > 0 && posts.map(post => (
          <PostCard key={post.created_at}  {...post}/>
        ))}
        </UserContext.Provider>
      </Layout>
    </div>
  );
}
