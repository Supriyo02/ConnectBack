import { useEffect, useState } from "react";
import Card from "./card";
import FriendInfo from "./friendinfo";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Postcard from "./postcard";

export default function ProfileContent({activeTab,userId}){
    const[posts,setPosts] = useState([]);
    const [profile,setProfile] = useState(null);
    const [aboutt,setAboutt] = useState();
    const[about,setAbout] = useState("");
    const [editMode, setEditMode] = useState(false);
    const supabase = useSupabaseClient();
    const session = useSession();
    useEffect(()=>{
        if(!userId){
            return;
        }
        if(activeTab === 'posts'){
          loadPosts().then(()=>{});
        }
        fetchUser();
    },[userId]);

    function fetchUser() {
      supabase
        .from("profiles")
        .select()
        .eq("id", userId)
        .then((result) => {
          if (result.error) {
            throw result.error;
          }
          if (result.data) {
            setAboutt(result.data[0]);
          }
        });
    }

    async function loadPosts(){
      const posts = await userPosts(userId);
      const profile = await userProfile(userId);
      setPosts(posts);
      setProfile(profile);
    }

    async function userPosts(userId){
      const {data} = await supabase.from('posts')
        .select('id,content,created_at, author, photos')
        .is('parent', null)
        .eq('author',userId);
        return data;
    }

    async function userProfile(userId){
      const {data} = await supabase.from('profiles')
      .select()
      .eq('id',userId);
      return data?.[0];
    }

    function saveAbout() {
      supabase
        .from("profiles")
        .update({
          about,
        })
        .eq("id", session.user.id)
        .then((result) => {
          if (!result.error) {
            setAboutt((prev) => {
              return { ...prev, about };
            });
          }
          setEditMode(false);
        });
    }

    const isMyUser = userId === session?.user?.id;

    return(
        <div>
        {activeTab==='posts' && (
        <div>
          {posts?.length>0 && posts.map(post=>(
            <Postcard key={post.created_at} {...post} profiles={profile} />
          ))}
        </div>
      )}
      {activeTab==='about' && (
        <div>
          <Card>
            <div className="p-4">
              <div className="flex mb-6 justify-between">
              <h2 className=" text-4xl font-semibold text-gray-400">
                About ME
              </h2>
              {isMyUser && !editMode && (
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setAbout(aboutt.about);
                    }}
                    className=" flex gap-1 shadow-gray-400 shadow-md rounded-md px-2 py-0.5 mb-2.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    <span className="md:block hidden">
                    Edit
                    </span>
                  </button>
                )}
                {isMyUser && editMode && (
                  <div>
                    <button
                      onClick={saveAbout}
                      className="gap-1 shadow-gray-400 shadow-md rounded-md px-1 py-0.5 mb-2.5"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="gap-1 shadow-gray-400 shadow-md rounded-md px-1 ml-1 py-0.5 mb-2.5"
                    >
                      Cancel
                    </button>
                  </div>
                  )}
              </div>
              {!editMode && (
                <p className="whitespace-pre-line mb-2 text-md text-gray-800">
                  {aboutt?.about}
                </p>
              )}
              {editMode && (
                  <div className="w-full">
                    <textarea
                      placeholder={"Enter your basic details:\nA suitable bio\nYour passion\nYour school/college name\nYour age\nSocial media handles\nContact info"}
                      value={about}
                      rows={5}
                      className="w-full border rounded-md p-1 text-md"
                      onChange={(ev) => setAbout(ev.target.value)}
                    />
                  </div>
                )}
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
            {/* <div className=" grid md:grid-cols-2 gap-3 md:px-3 md:py-3 px-4 py-3"> */}
              
              <div className="md:px-3 md:py-3 px-4 py-3">
                {posts.length>0 && posts.map((post)=>(
                  <div key={post.id}>
                    {post.photos.length>0 && post.photos.map((photo)=>(
                      <div key={photo} className="my-2">
                      <div className="rounded-sm overflow-hidden h-36 md:h-64 flex items-center shadow-md">
                        <img src={photo} className="w-full"/>
                      </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>


              {/* <div className=" rounded-sm overflow-hidden h-36 flex items-center shadow-md">
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
              </div> */}
            {/* </div> */}
          </Card>
        </div>
      )}
        </div>
    )
}