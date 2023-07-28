import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { cos } from "@tensorflow/tfjs";
import { addDoc, collection } from "firebase/firestore";

function Feedback() {
  console.log("clocked");
  let user = useAuthState(auth)?.[0];
  const [feedback, setFeedback] = useState({
    email: user?.email,
    message: "",
    date: "",
  });
  const onChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };
  const submit = () => {
    let date = new Date();
    setFeedback({ ...feedback, date: date });
    console.log(feedback);
    addDoc(collection(db, "feedback"), feedback)
      .then((res) => {
        setFeedback({...feedback, message:""});
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <>
     <div className="bg-blue-200">
     <section class="bg-blue-200 h-screen dark:bg-gray-900">
        <div class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
            Give your valueable feedback
          </h2>
          <div class="space-y-8">
            <div class="sm:col-span-2">
              <label
                for="message"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Your message
              </label>
              <textarea
                onChange={onChange}
                value={feedback.message}
                id="message"
                name="message"
                rows="6"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Leave a comment..."
              ></textarea>
            </div>
            <button
              // type="submit"
              onClick={submit}
              class="py-3 px-5 text-sm font-medium text-center text-black border bg-blue-400 rounded-lg bg-primary-700 sm:w-fit "
            >
              Send message
            </button>
          </div>
        </div>
      </section>
     </div>
    </>
  );
}

export default Feedback;
