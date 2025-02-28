import { useState } from 'react'
import '../App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
// import { API_KEY } from './config.js';


const systemMessage = { 
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}

function ChatBot() {
 
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Mental Health Bot! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }
    return(
    <div id='bot' style={{ height: "32rem", width: "25rem", marginLeft:"70%",marginRight:"50%"}}>
        <MainContainer style={{borderRadius:"12px",boxShadow: "2px 2px 10px 1px #333" }}>
          <ChatContainer>       
            <MessageList
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="Mental Health Bot is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    )
 }
 export default ChatBot


// import React, { useState } from 'react'
// // import "./App.css"
// import { IoCodeSlash, IoSend } from 'react-icons/io5'
// import { BiPlanet } from 'react-icons/bi'
// import { FaPython } from 'react-icons/fa'
// import { TbMessageChatbot } from 'react-icons/tb'
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const ChatBot = () => {
//   const [message, setMessage] = useState("");
//   const [isResponseScreen, setisResponseScreen] = useState(false);
//   const [messages, setMessages] = useState([]); 
//   let allMessages = [];

//   const hitRequest = () => {
//     if (message) {
//       generateResponse(message);
//     }
//     else {
//       alert("You must write somthing... !")
//     }
//   };

  
//   const generateResponse = async (msg) => {
//     if (!msg) return;
    
//     const genAI = new GoogleGenerativeAI("AIzaSyD_N7VHKTfjcLXvLvO9eNfTq24EurdfhRI");
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(msg);
    
//     const newMessages = [
//       ...messages,
//       { type: "userMsg", text: msg },
//       { type: "responseMsg", text: result.response.text() },
//     ];
    
//     setMessages(newMessages); // Append new messages to the existing ones
//     setisResponseScreen(true);
//     setMessage(""); // Clear the input field after sending the message
//     console.log(result.response.text());
//   };

//   const newChat = () => {
//     setisResponseScreen(false);
//     setMessages([]); // Clear the messages array
//   }

//   return (
//     <>
//       <div className="container w-screen min-h-screen overflow-x-hidden bg-[#0E0E0E] text-white">
//         {
//           isResponseScreen ?
//             <div className='h-[80vh]'>
//               <div className="header pt-[25px] flex items-center justify-between w-[100vw] px-[300px]">
//                 <h2 className='text-2xl'>AssistMe</h2>
//                 <button id='newChatBtn' className='bg-[#181818] p-[10px] rounded-[30px] cursor-pointer text-[14px] px-[20px]' onClick={newChat}>New Chat</button>
//               </div>

//               <div className="messages">
//               {
//                 messages?.map((msg, index) => {
//                   return (
//                     <div key={index} className={msg.type}>{msg.text}</div>
//                   )
//                 })
//               }
//                 {/* <div className="userMsg">You : What is the HTML stand for</div>
//                 <div className="responseMsg">HTML stand for Hyper Text Markup Language</div> */}
//               </div>
//             </div> :
//             <div className="middle h-[80vh] flex items-center flex-col justify-center">
//               <h1 className='text-4xl'>AssistMe</h1>
//               <div className="boxes mt-[30px] flex items-center gap-2">
//                 <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
//                   <p className='text-[18px]'>What is coding ? <br />
//                     How we can learn it.</p>

//                   <i className=' absolute right-3 bottom-3 text-[18px]'><IoCodeSlash /></i>
//                 </div>
//                 <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
//                   <p className='text-[18px]'>Which is the red <br />
//                     planet of solar <br />
//                     system </p>

//                   <i className=' absolute right-3 bottom-3 text-[18px]'><BiPlanet /></i>
//                 </div>

//                 <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
//                   <p className='text-[18px]'>In which year python <br />
//                     was invented ?</p>

//                   <i className=' absolute right-3 bottom-3 text-[18px]'><FaPython /></i>
//                 </div>

//                 <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
//                   <p className='text-[18px]'>How we can use <br />
//                     the AI for adopt ?</p>

//                   <i className=' absolute right-3 bottom-3 text-[18px]'><TbMessageChatbot /></i>
//                 </div>
//               </div>
//             </div>
//         }


//         <div className="bottom w-[100%] flex flex-col items-center">
//           <div className="inputBox w-[60%] text-[15px] py-[7px] flex items-center bg-[#181818] rounded-[30px]">
//             <input value={message} onChange={(e) => { setMessage(e.target.value) }} type="text" className='p-[10px] pl-[15px] bg-transparent flex-1 outline-none border-none' placeholder='Write your message here...' id='messageBox' />
//             {
//               message == "" ? "" : <i className='text-green-500 text-[20px] mr-5 cursor-pointer' onClick={hitRequest}><IoSend /></i>
//             }
//           </div>
//           <p className='text-[gray] text-[14px] my-4'>AssistMe is developed by Mo. Mahdi Farooqui. this AI use the gemini API for giving the response  </p>
//         </div>
//       </div>
//     </>
//   )
// }

// export default ChatBot

