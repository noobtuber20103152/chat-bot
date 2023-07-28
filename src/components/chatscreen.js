import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import * as tf from "@tensorflow/tfjs";
import {
  addDoc,
  collection,
  getDoc,
  orderBy,
  // userQuery,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
function ChatScreen(props) {
  const [loading, setLoading] = useState(false);
  const signout = () => {
    signOut(auth).then((res) => {
      console.log(res);
      props.setIsLoggedIn(false);
    });
  };
  let user = useAuthState(auth)?.[0];
  const [userQuery, setuserQuery] = useState("");
  const onChange = (e) => {
    setuserQuery(e.target.value);
  };
  const dbIntance = collection(db, `${user?.email}`);
  const q = query(dbIntance, orderBy("date"));
  const [_snapshot, loadin, error] = useCollection(q);
  const messages = _snapshot?.docs?.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const submit = async (input) => {
    addDoc(collection(db, `${user?.email}`), {
      user: true,
      msg: input,
      date: serverTimestamp(),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setuserQuery("");
    const configuration = new Configuration({
      apiKey: "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",
    });

    const openai = new OpenAIApi(configuration);
    setLoading(true);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a bot that specializes in providing academic and mental support to students",
        },
        { role: "user", content: userQuery },
      ],
    });
    addDoc(collection(db, `${user?.email}`), {
      user: false,
      msg: completion.data.choices[0].message.content,
      date: serverTimestamp(),
    });
    setLoading(false);
    console.log(completion);
  };
  return (
    <>
      <div className="bg-blue-200">
        <div class="flex-1 bg-white max-w-3xl mx-auto p:2 sm:p-6 justify-between flex flex-col h-screen">
          <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
            <div class="relative flex items-center space-x-4">
              <div class="relative">
                <span class="absolute text-green-500 right-0 bottom-0">
                  <svg width="20" height="20">
                    <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                  </svg>
                </span>
                <img
                  src="https://img.freepik.com/premium-vector/chatbot-icon-concept-chat-bot-chatterbot-robot-virtual-assistance-website_123447-1615.jpg?w=2000"
                  alt=""
                  class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                />
              </div>
              <div class="flex flex-col leading-tight">
                <div class="text-2xl mt-1 flex items-center">
                  <span class="text-gray-700 mr-3">Chat Bot</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <a
                type="button"
                href="/feedback"
                class="inline-flex items-center justify-center rounded-lg border px-2 py-2 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                Give your feedback
              </a>
              <button
                onClick={signout}
                // type="button"
                // href="/feedback"
                class="inline-flex items-center bg-red-400 justify-center rounded-lg border px-2 py-2 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div
            id="messages"
            class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          >
            {messages?.map((e) => {
              if (e.user) {
                return (
                  <>
                    <div class="chat-message">
                      <div class="flex items-end justify-end">
                        <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                          <div>
                            <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                              {e.msg}
                            </span>
                          </div>
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                          alt="My profile"
                          class="w-6 h-6 rounded-full order-2"
                        />
                      </div>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div class="chat-message">
                      <div class="flex items-end">
                        <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                          <div>
                            <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                              {e.msg}
                              <div>
                                <br />
                                <br />
                                <p>
                                  You can contact your mentor for more
                                  information
                                </p>
                                <p>Name: Rohan</p>
                                <p>Subject: Physics</p>
                                <p>Email: harshita100@gmail.com</p>
                                <p>Phone: 8890881463</p>
                              </div>
                            </span>
                          </div>
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                          alt="My profile"
                          class="w-6 h-6 rounded-full order-1"
                        />
                      </div>
                    </div>
                  </>
                );
              }
            })}
            {loading && (
            <div class="chat-message">
              <div class="flex items-end">
                <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                  <div>
                    <span class="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                  alt="My profile"
                  class="w-6 h-6 rounded-full order-1"
                />
              </div>
            </div>
          )}
          </div>
          <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            <div class="relative flex">
              <input
                onChange={onChange}
                value={userQuery}
                type="text"
                placeholder="Write your message!"
                class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              />
              <div class="absolute right-0 items-center inset-y-0 hidden sm:flex">
                <button
                  // type="button"
                  onClick={() => submit(userQuery)}
                  class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                >
                  <span class="font-bold">Send</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-6 w-6 ml-2 transform rotate-90"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatScreen;
