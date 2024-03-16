"use client";
import Card from "../components/card";
import Layout from "../components/layout";
import Avatar from "../components/avatar";
import Postcard from "../components/postcard";
import FriendInfo from "../components/friendinfo";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Cover from "../components/Cover";
import ProfileTabs from "../components/ProfileTabs";
import ProfileContent from "../components/ProfileContent";
import { UserContext, UserContextProvider } from "../components/contexts/UserContext";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [editMode, setEditMode] = useState(false);
  const tab = router?.query?.tab?.[0] || "about";
  const userId = router.query.id;
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchUser();
  }, [userId]);

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
          setProfile(result.data[0]);
        }
      });
  }

  function saveProfile() {
    supabase
      .from("profiles")
      .update({
        name,
        place,
      })
      .eq("id", session.user.id)
      .then((result) => {
        if (!result.error) {
          setProfile((prev) => {
            return { ...prev, name, place };
          });
        }
        setEditMode(false);
      });
  }

  const session = useSession();

  const isMyUser = userId === session?.user?.id;

  return (
    <Layout>
      <UserContextProvider>
        <Card noPadding={true}>
          <div className=" relative overflow-hidden rounded-md">
            <Cover
              url={profile?.cover}
              editable={isMyUser}
              onChange={fetchUser}
            />
            <div className="absolute top-28 left-2 z-20">
              {profile && (
                <Avatar
                  url={profile.avatar}
                  size={"lg"}
                  editable={isMyUser}
                  onChange={fetchUser}
                />
              )}
            </div>
            <div className=" md:pb-6 md:pt-6 pt-3 pb-12 md:pl-44 pl-36 flex justify-between">
              <div>
                {editMode && (
                  <div className="ml-4 md:text-3xl text-md font-bold">
                    <input
                      type="text"
                      placeholder={"Your name"}
                      value={name}
                      className=" md:max-w-72 max-w-32 border rounded-md p-1"
                      onChange={(ev) => setName(ev.target.value)}
                    />
                  </div>
                )}
                {!editMode && (
                  <h2 className="ml-4 md:text-3xl text-md font-bold">
                    {profile?.name}
                  </h2>
                )}
                {!editMode && (
                  <div className=" text-gray-500 ml-4 leading-4 md:text-sm text-xs">
                    {profile?.place || "Kolkata"}
                  </div>
                )}
                {editMode && (
                  <div className="ml-4">
                    <input
                      type="text"
                      placeholder={"Your location"}
                      value={place}
                      className=" md:max-w-72 max-w-32 border rounded-md p-1 md:text-sm text-xs"
                      onChange={(ev) => setPlace(ev.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="mr-6">
                {isMyUser && !editMode && (
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setName(profile.name);
                      setPlace(profile.place);
                    }}
                    className=" flex gap-1 shadow-gray-400 shadow-md rounded-md px-2 py-0.5"
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
                <div className="text-right">
                  {isMyUser && editMode && (
                    <button
                      onClick={saveProfile}
                      className="md:text-base text-xs flex gap-1 shadow-gray-400 shadow-sm rounded-md px-2 py-0.5"
                    >
                      Save
                    </button>
                  )}
                  {isMyUser && editMode && (
                    <button
                      onClick={() => setEditMode(false)}
                      className=" md:text-base text-xs flex gap-1 shadow-gray-400 mt-1 shadow-sm rounded-md px-2 py-0.5"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
            <ProfileTabs active={tab} userId={profile?.id} />
          </div>
        </Card>
        <ProfileContent activeTab={tab} userId={userId} />
        </UserContextProvider>
    </Layout>
  );
}
