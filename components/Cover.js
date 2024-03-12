import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Preloader from "./Preloader";
import { Edu_QLD_Beginner } from "next/font/google";

export default function Cover({ url, editable, onChange }) {
    const supabase = useSupabaseClient();
    const [isUploading,setIsUploading] = useState(false);
  const session = useSession();

    async function updateCover(ev){
        const file = ev.target.files?.[0];
        if(file){
          setIsUploading(true);
            const newName = Date.now() + file.name;
            const {data,error} = await supabase.storage.from('covers')
            .upload(newName, file);

            setIsUploading(false);
            if(error) throw error;
            if(data){
                const url = process.env.NEXT_PUBLIC_SUPABASE_URL +
                '/storage/v1/object/public/covers/' +
                data.path;
                supabase.from('profiles').update({
                  cover: url,
                })
                .eq('id',session.user.id)
                .then(result=>{
                  if(!result.error && onChange){
                    onChange();
                  }
                })
            }
        }
    }

  return (
    <div className=" h-40 overflow-hidden flex justify-center place-items-start relative">
      <div>
        <img src={url} />
      </div>
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center z-10" >
          <div className="inline-block mx-auto">
            <Preloader />
          </div>
        </div>
      )}
      {editable && (
        <div className="absolute right-1 bottom-1 m-">
          <label className="bg-white py-0.5 px-2 items-center cursor-pointer rounded-md flex gap-1 shadow-md shadow-black opacity-85">
            <input type="file" onChange={updateCover} className="hidden"/>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
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
            Change Cover
          </label>
        </div>
      )}
    </div>
  );
}
