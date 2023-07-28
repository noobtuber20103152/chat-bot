import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/loginpage";
import Signup from "./components/signuppage";
import ChatScreen from "./components/chatscreen";
import Feedback from "./components/feedback";
import Admin from "./components/admin";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [student, setStudent] = useState(true);
  let user = useAuthState(auth)?.[0];
  console.log(user);
  if (user) {
    if (user?.email === "harshita100@gmail.com") {
      return (
        <>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Admin />}></Route>
            </Routes>
          </BrowserRouter>
        </>
      );
    } else {
      return (
        <>
          <BrowserRouter>
            <Routes>
              <Route
                exact
                path="/"
                element={<ChatScreen setIsLoggedIn={setIsLoggedIn} />}
              ></Route>
            </Routes>
            <Routes>
              <Route exact path="/feedback" element={<Feedback />}></Route>
            </Routes>
          </BrowserRouter>
        </>
      );
    }
  } else {
   return <>
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Login setStudent={setStudent} setIsLoggedIn={setIsLoggedIn} />
          }
          exact
          path="/"
        ></Route>
      </Routes>
      <Routes>
        <Route element={<Signup />} exact path="/signup"></Route>
      </Routes>
    </BrowserRouter>;
   </>
  }
}

export default App;
