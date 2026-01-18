'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Conversations from '../components/inbox/Conversation';
import apiService from '../services/apiService';
import { getUserId } from '../lib/actions';

export type UserType = {
    id:string;
    name:string;
    avatar_url:string;
}

export type ConversationType = {
    id:string;
    users: UserType[];
}

const InboxPage = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const id = await getUserId();
            setUserId(id);

            if (id) {
                try {
                    const response = await apiService.get('/api/v1/chat/')
                    setConversations(Array.isArray(response) ? response : (response?.data || []));
                } catch (error) {
                    // console.error('Failed to fetch conversations:', error);
                }
            }
        };
        fetchData();
    }, []);

    if (!userId) {
        return (
            <main className='max-w-[1500px] max-auto px-6 py-12'>
                <p>You need to be Authenticated...</p>
            </main>
        )
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6 space-y-4">
            <h1 className='my-6 text-2xl'>Inbox</h1>
            
                {conversations.filter((conversation: ConversationType) => 
                    Array.isArray(conversation.users) &&
                    conversation.users.some(user => user.id !== userId)
                ).length === 0 ? (
                    <p className="text-gray-500">No conversations yet</p>
                ) : (
                    <>
                        {conversations
                            .filter((conversation: ConversationType) => 
                                Array.isArray(conversation.users) &&
                                conversation.users.some(user => user.id !== userId)
                            )
                            .map((conversation: ConversationType) => (
                                <Conversations 
                                    key={conversation.id}
                                    userId={userId}
                                    conversation={conversation}
                                />
                            ))}
                    </>
                )}

        </main>
        

    )
}

export default InboxPage;