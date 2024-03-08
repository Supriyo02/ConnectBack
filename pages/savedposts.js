import Layout from "../components/layout";
import PostCard from "../components/postcard";

export default function SavedPosts(){
    return(
        <Layout>
            <h1 className=" text-3xl font-bold text-gray-400 mb-4">Saved Posts</h1>
            <PostCard />
            <PostCard />
            <PostCard />
        </Layout>
    );
}