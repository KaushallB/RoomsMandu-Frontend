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

// Call states
type CallState = 'idle' | 'calling' | 'incoming' | 'in-call';

const ConversationDetail: React.FC<ConversationDetailProps> = ({
    conversation,
    userId,
    conversationId,
    messages
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [callState, setCallState] = useState<CallState>('idle');
    const [incomingCall, setIncomingCall] = useState<{callerName: string, roomName: string, jitsiUrl: string} | null>(null);
    const [currentCallUrl, setCurrentCallUrl] = useState<string>('');
    
    const myuser = conversation.users?.find((user) => user.id == userId )
    const otherUser = conversation.users?.find((user) => user.id != userId )
    const messageDiv = useRef(null);
    const [realtimeMsg, setrealtimeMsg] = useState<MessageType[]>([]);

    const wsHost = (process.env.NEXT_PUBLIC_WS_HOST || 'ws://127.0.0.1:8002').replace(/\/$/, '');
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`${wsHost}/ws/${conversationId}/`,{
        share: false,
        shouldReconnect:() => true,
        },
    )

    useEffect(() => {
        if (lastJsonMessage && typeof lastJsonMessage === 'object') {
            const msg = lastJsonMessage as Record<string, unknown>;
            const event = msg.event as string | undefined;
            
            // Handle call events
            if (event === 'call_request' && msg.caller_id !== userId) {
                // Someone is calling me
                setCallState('incoming');
                setIncomingCall({
                    callerName: msg.caller_name as string,
                    roomName: msg.room_name as string,
                    jitsiUrl: msg.jitsi_url as string
                });
            } else if (event === 'call_accepted') {
                // Call was accepted - open the call
                setCallState('in-call');
                window.open(msg.jitsi_url as string, '_blank');
                setTimeout(() => setCallState('idle'), 1000);
            } else if (event === 'call_declined') {
                // Call was declined
                setCallState('idle');
                setIncomingCall(null);
            } else if (event === 'typing' && msg.user_id !== userId) {
                // Only show typing if it's from the other user
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
            } else if ('name' in msg && 'body' in msg && !event){
                const messages: MessageType = {
                    id: '',
                    name: msg.name as string,
                    body: msg.body as string,
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

    const startVideoCall = () => {
        // Generate room name and Jitsi URL
        const roomName = `RoomsMandu_${conversationId}_${Date.now()}`;
        const jitsiUrl = `https://jitsi.riot.im/${roomName}`;
        
        setCallState('calling');
        setCurrentCallUrl(jitsiUrl);
        
        // Send call request via WebSocket (include receiver_id for global notification)
        sendJsonMessage({
            event: 'call_request',
            caller_id: userId,
            caller_name: myuser?.name || 'Someone',
            receiver_id: otherUser?.id,
            room_name: roomName,
            jitsi_url: jitsiUrl
        });
        
        // Auto-cancel after 30 seconds if no response
        setTimeout(() => {
            if (callState === 'calling') {
                setCallState('idle');
            }
        }, 30000);
    }

    const acceptCall = () => {
        if (incomingCall) {
            // Send acceptance via WebSocket
            sendJsonMessage({
                event: 'call_accepted',
                room_name: incomingCall.roomName,
                jitsi_url: incomingCall.jitsiUrl
            });
            
            // Open the call
            window.open(incomingCall.jitsiUrl, '_blank');
            setCallState('idle');
            setIncomingCall(null);
        }
    }

    const declineCall = () => {
        sendJsonMessage({ event: 'call_declined' });
        setCallState('idle');
        setIncomingCall(null);
    }

    const cancelCall = () => {
        sendJsonMessage({ event: 'call_declined' });
        setCallState('idle');
    }

    return (
    <>
        {/* Incoming Call Modal */}
        {callState === 'incoming' && incomingCall && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Incoming Video Call</h3>
                    <p className="text-gray-600 mb-6">{incomingCall.callerName} is calling...</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={declineCall}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
                        >
                            Decline
                        </button>
                        <button
                            onClick={acceptCall}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Calling Modal */}
        {callState === 'calling' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Calling...</h3>
                    <p className="text-gray-600 mb-6">Waiting for {otherUser?.name} to answer</p>
                    <button
                        onClick={cancelCall}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Cancel Call
                    </button>
                </div>
            </div>
        )}

        {/* Video Call Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                        {otherUser?.name?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <span className="font-semibold">{otherUser?.name}</span>
            </div>
            <button
                onClick={startVideoCall}
                disabled={callState !== 'idle'}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span>Video Call</span>
            </button>
        </div>

        <div  
            ref={messageDiv}
            className="max-h-[400px] overflow-auto flex flex-col space-y-4 "
        >

            {messages.map((message, index) => (
                <div
                        key={index}
                        className={`w-[80%] py-4 px-6 rounded-xl text-white ${message.created_by?.name == myuser?.name ? 'ml-[20%] bg-blue-600' : 'bg-red-400'}`}
                    >
                        <p className="font-bold text-white">{message.created_by?.name}</p>
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
                    sendJsonMessage({ event: 'typing', user_id: userId });
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