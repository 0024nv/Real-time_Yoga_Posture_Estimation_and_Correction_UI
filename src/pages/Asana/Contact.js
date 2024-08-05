import { useEffect } from 'react';
import React from 'react';
import { io } from 'socket.io-client';

export default function Contact() {

  useEffect(()=>{

      console.log("Is this running");
      //THis will connect the app
      const socket = io("http://127.0.0.1:5000");

      socket.on("connect", ()=>{
          console.log("connected");
          socket.emit("my event", {"data": "IDK"});
      });

      //This will happen when the server emits something
      socket.on("message", (data)=>{
        console.log("yaha aaya hai dekhho : ", data);
          console.log(data);
      });

      // socket.disconnect();
  
    }, []);

    return(
      <div></div>
    );
}
