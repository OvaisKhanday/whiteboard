// import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useKeycloak } from "@react-keycloak/web";
import { v4 as uuidv4 } from "uuid";
import { socket } from "./socket";
import { useNavigate } from "react-router";

// import Whiteboard from "./components/Whiteboard";

interface User {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  preferred_username: string;
  sub: string;
}
function App() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    keycloak.loadUserInfo().then((userInfo) => {
      const user = userInfo as User;
      setUser(user);
      localStorage.setItem("userId", user.sub);
      localStorage.setItem("userName", user.name);
    });
  });

  function createSession() {
    const roomId = uuidv4();
    localStorage.setItem("roomId", roomId);
    socket.emit("join_room", roomId);
    navigate("/whiteboard");
  }
  function joinSession() {
    localStorage.setItem("roomId", inputRef.current?.value ?? "");
    socket.emit("join_room", inputRef.current?.value);
    navigate("/whiteboard");
  }
  return (
    <div>
      <h1 className='font-bold mb-8'>Collaborative Whiteboard</h1>
      <div className='text-xl text-zinc-400'>
        Welcome <span className='text-zinc-100'>{user?.name ?? ""}</span>
      </div>
      <div className='flex flex-col max-w-sm m-auto gap-3 mt-4'>
        <button onClick={createSession} className='bg-blue-500'>
          Create a session
        </button>
        <p>OR</p>
        <div className='flex flex-col gap-2'>
          <input type='text' className='p-5 rounded-lg' placeholder='enter id' ref={inputRef} />
          <button onClick={joinSession}>Join a session</button>
        </div>
      </div>

      {/* <Whiteboard /> */}
      {/* <Chat /> */}
    </div>
  );
}

export default App;
