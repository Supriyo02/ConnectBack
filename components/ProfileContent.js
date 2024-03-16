import { useEffect, useState } from "react";
import Card from "./card";
import FriendInfo from "./friendinfo";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Postcard from "./postcard";

export default function ProfileContent({activeTab,userId}){
    const[posts,setPosts] = useState([]);
    const [profile,setProfile] = useState(null);
    const supabase = useSupabaseClient();
    useEffect(()=>{
        if(!userId){
            return;
        }
        if(activeTab === 'posts'){
          loadPosts().then(()=>{});
        }
    },[userId]);

    async function loadPosts(){
      const posts = await userPosts(userId);
      const profile = await userProfile(userId);
      setPosts(posts);
      setProfile(profile);
    }

    async function userPosts(userId){
      const {data} = await supabase.from('posts')
        .select('id,content,created_at, author, photos')
        .eq('author',userId);
        return data;
    }

    async function userProfile(userId){
      const {data} = await supabase.from('profiles')
      .select()
      .eq('id',userId);
      return data[0];
    }
    
    return(
        <div>
        {activeTab==='posts' && (
        <div>
          {posts.length>0 && posts.map(post=>(
            <Postcard key={post.created_at} {...post} profiles={profile} />
          ))}
        </div>
      )}
      {activeTab==='about' && (
        <div>
          <Card>
            <div className="p-4">
              <h2 className=" text-4xl font-semibold mb-6 text-gray-400">
                About ME
              </h2>
              <p className=" mb-2 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="mb-2 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </Card>
        </div>
      )}
      {activeTab==='friends' && (
        <div>
          <Card>
            <div className="p-4">
              <h2 className=" text-4xl font-semibold mb-6 ml-2 text-gray-400">
                Friends
              </h2>
              <div>
                <div className=" border-b -mx-2 p-0.5">
                  <FriendInfo />
                </div>
                <div className=" border-b -mx-2 p-0.5">
                  <FriendInfo />
                </div>
                <div className=" border-b -mx-2 p-0.5">
                  <FriendInfo />
                </div>
                <div className=" border-b -mx-2 p-0.5">
                  <FriendInfo />
                </div>
                <div className=" border-b -mx-2 p-0.5">
                  <FriendInfo />
                </div>
                <div className=" border-b -mx-2 p-0.5">
                  <FriendInfo />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      {activeTab==='photos' && (
        <div>
          <Card>
            <div className=" grid md:grid-cols-2 gap-3 md:px-3 md:py-3 px-4 py-3">
              <div className=" rounded-sm overflow-hidden  h-36 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1571679654681-ba01b9e1e117?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" />
              </div>
              <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1561909381-3d716364ad47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8a29sa2F0YXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=900&q=60" />
              </div>
              <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
                <img src="https://media.istockphoto.com/id/1179806246/photo/holi-and-durga-puja-festival-in-indian-married-and-unmarried-indian-women-playing-with.jpg?s=612x612&w=0&k=20&c=OYuG7feijVKCkwKQ-O4gFABIYg9JmgaoLUQrbHr-utU=" />
              </div>
              <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1599936541117-d032c94719a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" />
              </div>
              <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1558431382-27e303142255?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" />
              </div>
              <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" />
              </div>
              <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1634065611106-baf90d226d7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" />
              </div>
              <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1599831013079-1aa9b2092f08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1900&q=80" />
              </div>
              <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1470163395405-d2b80e7450ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" />
              </div>
              <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1630880276407-7e0c38d4df24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" />
              </div>
            </div>
          </Card>
        </div>
      )}
        </div>
    )
}