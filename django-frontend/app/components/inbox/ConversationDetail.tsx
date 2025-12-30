'use client';

import useWebSocket, {ReadyState} from "react-use-websocket";
import CustomButton from "../forms/CustomButton";
import { ConversationType, UserType } from "@/app/inbox/page";
import { useEffect, useState, useRef } from "react";
import { MessageType } from "@/app/inbox/[id]/page";

interface ConversationDetailProps{
    conversation: ConversationType;
    userId: string;
    conversationId: string;
    messages: MessageType[];
}
const ConversationDetail: React.FC<ConversationDetailProps> = ({
    conversation,
    userId,
    conversationId,
    messages
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const myuser = conversation.users?.find((user) => user.id == userId )
    const otherUser = conversation.users?.find((user) => user.id != userId )
    const messageDiv = useRef(null);
    const [realtimeMsg, setrealtimeMsg] = useState<MessageType[]>([]);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`ws://127.0.0.1:8000/ws/${conversationId}/`,{
        share: false,
        shouldReconnect:() => true,
        },
    )

    useEffect(() => {
        console.log('Connection state changed', readyState);
    }, [readyState])

    useEffect(() => {
        if (lastJsonMessage && typeof lastJsonMessage === 'object') {
            if (lastJsonMessage.event === 'typing') {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
            } else if ('name' in lastJsonMessage && 'body' in lastJsonMessage){
                const messages: MessageType = {
                    id: '',
                    name: lastJsonMessage.name as string,
                    body: lastJsonMessage.body as string,
                    sent_to: otherUser as UserType,
                    created_by: myuser as UserType,
                    conversationId: conversationId
                }

                setrealtimeMsg((realtimeMsg) => [...realtimeMsg, messages]);
                setIsTyping(false);
            }
        }
        scrollToBottom();
    }, [lastJsonMessage])

    const sendMessage = async () => {
        if (!newMessage.trim() || !otherUser?.id || !myuser?.name || !myuser?.id) {
            return;
        }

        sendJsonMessage({
            event: 'chat_message',
            data: {
                body: newMessage,
                name: myuser.name,
                sent_to_id: otherUser.id,
                created_by_id: myuser.id,
                conversation_id: conversationId
            }
        });

        setNewMessage('');

        setTimeout(() => {
            scrollToBottom()
        }, 50);
    }

    const scrollToBottom = () => {
        if (messageDiv.current) {
            messageDiv.current.scrollTop = messageDiv.current.scrollHeight;
        }
    }

    return (
    <>
        <div  
            ref={messageDiv}
            className="max-h-[400px] overflow-auto flex flex-col space-y-4 "
        >

            {messages.map((message, index) => (
                <div
                        key={index}
                        className={`w-[80%] py-4 px-6 rounded-xl text-white ${message.created_by.name == myuser?.name ? 'ml-[20%] bg-blue-600' : 'bg-red-400'}`}
                    >
                        <p className="font-bold text-white">{message.created_by.name}</p>
                        <p>{message.body}</p>
                    </div>
            ))}

            {realtimeMsg.map((message, index) => (
                    <div
                        key={index}
                        className={`w-[80%] py-4 px-6 rounded-xl text-white ${message.name == myuser?.name ? 'ml-[20%] bg-blue-600' : 'bg-red-400'}`}
                    >
                        <p className="font-bold text-white">{message.name}</p>
                        <p>{message.body}</p>
                    </div>
            ))}
            
            {isTyping && (
                <div className="w-[80%] py-4 px-6 rounded-xl bg-gray-400 text-white">
                    <p className="text-sm italic">{otherUser?.name} is typing...</p>
                </div>
            )}
        </div>

        <div className="mt-4 py-4 px-6 flex border border-gray-300 space-x-4 rounded-xl">
            <input
                type="text"
                placeholder="Type your message..."
                className="w-full p-2 bg-gray-200 rounded-xl"
                value={newMessage}
                onChange={(e) => {
                    setNewMessage(e.target.value);
                    sendJsonMessage({ event: 'typing' });
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                }}
                />

                <CustomButton 
                    label='Send'
                    onClick={sendMessage}
                    className="w-[100px]"
                />
        </div>
    </>

        
        
    )
}

export default ConversationDetail;