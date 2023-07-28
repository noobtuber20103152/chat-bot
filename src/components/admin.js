import React, { useState } from "react";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
function Admin() {
  const logout = () => {
    signOut(auth);
  };
  const [snapshot, loading, error] = useCollection(collection(db, "feedback"));
  const feedback = snapshot?.docs?.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return (
    <>
      <div className="max-w-3xl mx-auto my-10">
        <button onClick={logout} className="px-2 py-2 bg-red-100">
          Logout
        </button>
      </div>
      <div className="max-w-3xl mx-auto">
        {feedback?.map((e) => {
          return (
            <>
              <div class="max-w-sm rounded-lg border w-full lg:max-w-full lg:flex my-2">
                <div class="  rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                  <div class="mb-8">
                    <p class="text-gray-700 text-base">{e?.message}</p>
                  </div>
                  <div class="flex items-center">
                    <div class="text-sm">
                      <p class="text-gray-900 leading-none">{e.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default Admin;
