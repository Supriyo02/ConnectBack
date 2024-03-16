import Image from "next/image";
import { uploadUserProfileImage } from "./helpers/user";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Preloader from "./preloader";
import { useState } from "react";

export default function Avatar({ size, url, editable, onChange }) {
    const supabase = useSupabaseClient();
    const session = useSession();
    const [isUploading, setIsUploading] = useState(false);
    async function handleAvatarChange(ev){
        const file = ev.target.files?.[0];
        if(file){
            setIsUploading(true);
            await  uploadUserProfileImage(supabase,session.user.id, file, 'avatars', 'avatar');
            setIsUploading(false);
            if(onChange) onChange();
        }
    }

  let width = "w-11";
  if (size === "lg") {
    width = "w-32 md:w-36";
  }
  if (size === "sm") {
    width = "w-9";
  }

  if(!url){
    url="https://yellowchimes.com/cdn/shop/products/71LECcYMuNL.jpg?v=1695302947"
  }


  return (
    <div className="p-2 relative">
      <div>
        <img
          className={`${width} rounded-full overflow-hidden`}
          src={url}
          alt=""
        />
      </div>
      {isUploading && (
        <div className="absolute inset-0 flex items-center bg-white bg-opacity-60 rounded-full"> 
            <div className="inline-block mx-auto">
                <Preloader />
            </div>
        </div>
      )}
      {editable && (
        <label className="absolute bottom-2.5 right-2.5 shadow-gray-500 shadow-md p-1.5 bg-white rounded-full cursor-pointer">
            <input type="file" className="hidden" onChange={handleAvatarChange}/>
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
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
            />
          </svg>
        </label>
      )}
    </div>
  );
}
