import { useEffect, useState } from "react";
import Layout from "../components/layout";
import PostCard from "../components/postcard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserContextProvider } from "../components/contexts/UserContext";

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const supabase = useSupabaseClient();
  const session = useSession();
  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase
      .from("saved_posts")
      .select("post_id")
      .eq("user_id", session.user.id)
      .then((result) => {
        const postsIds = result.data.map((item) => item.post_id);
        supabase
          .from("posts")
          .select("*, profiles(*)")
          .in("id", postsIds)
          .then((result) => setPosts(result.data));
      });
  }, [session?.user?.id]);

  return (
    <Layout>
      <UserContextProvider>
        <h1 className=" text-3xl font-bold text-gray-400 mb-4">Saved Posts</h1>
        {posts.length > 0 &&
          posts.map((post) => (
            <div key={post.id}>
              <PostCard {...post} />
            </div>
          ))}
      </UserContextProvider>
    </Layout>
  );
}
