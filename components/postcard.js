"use client";
import Card from "./card";
import Avatar from "./avatar";
import ClickOutHandler from "react-clickout-handler";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import { UserContext } from "./contexts/UserContext";
import en from "javascript-time-ago/locale/en";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { locale } from "javascript-time-ago";
TimeAgo.addLocale(en);

export default function Postcard({
  id,
  content,
  created_at,
  photos,
  profiles: authorProfile,
}) {
  const supabase = useSupabaseClient();
  const [likes, setLikes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const inactiveElements =
    "flex gap-2 p-2 hover:bg-blue-300 hover:bg-opacity-40 rounded-md hover:-mx-2 transition-all hover:shadow-sm hover:shadow-gray-400 hover:text-base";
  const { profile: myProfile } = useContext(UserContext);
  useEffect(() => {
    fetchLikes();
    fetchComments();
    if(myProfile?.id) fetchIsSaved();
  }, [myProfile?.id]);

  function fetchIsSaved() {
    supabase
      .from("saved_posts")
      .select()
      .eq("post_id", id)
      .eq("user_id", myProfile?.id)
      .then((result) => {
        if (result.data.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      });
  }

  function fetchLikes() {
    supabase
      .from("likes")
      .select()
      .eq("post_id", id)
      .then((result) => setLikes(result.data));
  }

  function fetchComments() {
    supabase
      .from("posts")
      .select("*, profiles(*)")
      .eq("parent", id)
      .then((result) => setComments(result.data));
  }

  function toggleLike() {
    if (isLikedByMe) {
      supabase
        .from("likes")
        .delete()
        .eq("post_id", id)
        .eq("user_id", myProfile.id)
        .then(() => {
          fetchLikes();
        });
      return;
    }
    supabase
      .from("likes")
      .insert({
        post_id: id,
        user_id: myProfile.id,
      })
      .then((result) => {
        fetchLikes();
      });
  }

  function postComment(ev) {
    ev.preventDefault();
    supabase
      .from("posts")
      .insert({
        content: commentText,
        author: myProfile.id,
        parent: id,
      })
      .then((result) => {
        fetchComments();
        setCommentText("");
      });
  }

  function toggleSave() {
    if(isSaved){
      supabase.from('saved_posts')
      .delete().eq('post_id', id)
      .eq('user_id',myProfile?.id)
      .then(result=>{
        setIsSaved(false);
        setDropdownOpen(false);
      });
    }
    if(!isSaved){
      supabase
      .from("saved_posts")
      .insert({
        user_id: myProfile?.id,
        post_id: id,
      })
      .then((result) => {
        setIsSaved(true);
        setDropdownOpen(false);
      });
    } 
  }

  const isLikedByMe = !!likes.find((like) => like?.user_id === myProfile?.id);

  return (
    <Card>
      <div className="flex pt-3 px-2 items-center grow">
        <Link href={"/profile/" + authorProfile?.id}>
          <span className="cursor-pointer">
            <Avatar url={authorProfile?.avatar} />
          </span>
        </Link>
        <div className="grow">
          <p className="text-black-600 text-md">
            <Link href={"/profile/" + authorProfile?.id}>
              <span className="font-semibold hover:underline">
                {authorProfile?.name}{" "}
              </span>
            </Link>
            shared a{" "}
            <a href="#" className="font-semibold">
              post
            </a>
          </p>
          <p className="text-gray text-sm">
            <ReactTimeAgo date={new Date(created_at).getTime()} locale="en-US" />
          </p>
        </div>
        <div className="relative">
          <button
            className="text-gray-500  pr-5"
            onClick={() => setDropdownOpen(true)}
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
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
          <ClickOutHandler
            onClickOut={() => {
              setDropdownOpen(false);
            }}
          >
            <div>
              {dropdownOpen && (
                <div className="absolute -right-4 bg-white shadow-md shadow-gray-500 rounded-md px-1 py-2 border border-gray-300 w-44">
                  <button onClick={toggleSave} href="" className="w-full">
                    <span className={inactiveElements + ` flex`}>
                      {!isSaved && (
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
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                          />
                        </svg>
                      )}
                      {isSaved && (
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
                            d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
                          />
                        </svg>
                      )}

                      {isSaved ? "Unsave" : "Save Post"}
                    </span>
                  </button>
                  <a href="" className={inactiveElements}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                      />
                    </svg>
                    Turn on notifications
                  </a>
                  <a href="" className={inactiveElements}>
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Hide Post
                  </a>
                  <a href="" className={inactiveElements}>
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </a>
                  <a href="" className={inactiveElements}>
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
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    Report
                  </a>
                </div>
              )}
            </div>
          </ClickOutHandler>
        </div>
      </div>
      <div className="py-2 px-5">
        <p className="text-sm">{content}</p>
      </div>
      <div className="px-5 py-2">
        {photos?.length > 0 && (
          <div className="flex gap-4 items-center">
            {photos.map((photo) => (
              <div key={photo}>
                <img
                  className="rounded-md overflow-hidden"
                  src={photo}
                  alt=""
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-6 pl-6 items-center">
        <button onClick={toggleLike} className="flex gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={"w-6 h-6" + (isLikedByMe ? " fill-red-500" : "")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          {likes?.length}
        </button>
        <div className="flex gap-1">
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
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          {comments.length}
        </div>
        <div className="flex gap-1">
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
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
          2
        </div>
      </div>
      <div className="flex mt-2">
        <Avatar url={myProfile?.avatar} />
        <div className="flex w-full pr-3 h-12 pt-2 gap-1">
          <div className=" w-11/12">
            <form onSubmit={postComment}>
              <input
                value={commentText}
                onChange={(ev) => setCommentText(ev.target.value)}
                className="w-full rounded-full h-10 overflow-hidden border border-gray-400 block pl-3"
                placeholder="Leave a comment"
              />
            </form>
          </div>
          <button className="right-6 top-4 w-1/12">
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
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className=" ml-1 md:ml-4 pb-2">
        {comments.length > 0 &&
          comments.map((comment) => (
            <div key={comment.id} className="flex items-center mb-1">
              <Avatar url={comment.profiles.avatar} size={"sm"} />
              <div className="bg-gray-200 px-5 py-1 rounded-3xl">
                <div>
                  <Link href={"/profile/" + comment.profiles.id}>
                    <span className="-mb-1 mr-1 font-semibold hover:underline">
                      {comment.profiles.name}
                    </span>
                  </Link>
                  <span className="text-sm text-gray-500">
                    <ReactTimeAgo
                      timeStyle={"twitter"}
                      date={new Date(comment.created_at).getTime()}
                      locale="en-US"
                    />
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
}

// export default Postcard;
