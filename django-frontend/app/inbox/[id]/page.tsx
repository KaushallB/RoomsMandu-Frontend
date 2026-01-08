'use client';

import React, {useState, useEffect, use} from 'react';
import ConversationDetail from '@/app/components/inbox/ConversationDetail';
import { getUserId } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';
import { UserType } from '../page';

export type MessageType = {
    id: string;
    name: string;
    body: string;
    conversationId: string;
    sent_to: UserType;
    created_by: UserType
}

const ConversationPage = ({params}: {params: Promise<{id: string}>}) => {
    const {id} = use(params);
    const [userId, setUserId] = useState('');
    const [conversation, setConversation] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const uid = await getUserId();
            setUserId(uid);

            if (id && id !== 'undefined') {
                const response = await apiService.get(`/api/v1/chat/${id}/`);
                setConversation(response.conversation || response);
            }
        };
        fetchData();
    }, [id]);

    if (!id){
        return (
            <main className='max-w-[1500px] max-auto px-6 py-12'>
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            {conversation && (
                <ConversationDetail 
                    userId={userId}
                    conversation={conversation}
                    conversationId={id}
                    messages={conversation.messages}
                />
            )}
        </main>
    )
}

export default ConversationPage;
