import React, {useState,useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

import './chat.css';

let socket;

const Chat = ({location}) =>{

    const [name,setName]=useState('');
    const [room,setRoom]=useState('');
    const [users, setUsers] = useState('');
    const [message,setMessage]=useState('');
    const [messages,setMessages]=useState([]);

    const ENDPOINT = 'localhost:5000';
    var connectionOptions =  {
        "force new connection" : true,
        "reconnectionAttempts": "Infinity", 
        "timeout" : 10000,                  
        "transports" : ["websocket"]
    };

    useEffect(()=>{
        //destructuring name and room through url
        const {name,room} = queryString.parse(location.search);

        //socket endpoint
        socket = io.connect(ENDPOINT,connectionOptions);

        setName(name);
        setRoom(room);

        socket.emit('join',{name,room},()=>{

        });

        return () =>{
            socket.emit('disconnect');
            socket.off();
        }
        
    },[ENDPOINT,location.search]);

    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message]);
        })
        return () => {
            socket.off()
          }
    },[messages]);

    //function for sending msgs
    const sendMessage=(event)=>{
        event.preventDefault();

        if(message){
            socket.emit('sendMessage',message,()=> setMessage(''));
        }
    }

    console.log(message,messages);

    return(
        <div className="outerContainer">
        <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>

        </div>
        <TextContainer users={users}/>
        </div>
    )
}

export default Chat;