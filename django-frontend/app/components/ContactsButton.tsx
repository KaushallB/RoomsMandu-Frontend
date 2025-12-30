'use client';

import useLoginModal from '../hooks/useLoginModal';
import {useRouter} from 'next/navigation';
import apiService from '../services/apiService';

interface ContactButtonProps {
    userId: string | null;
    landlordId: string;
}

const ContactsButton: React.FC<ContactButtonProps> = ({
    userId,
    landlordId
}) => {

    const loginModal = useLoginModal();
    const router = useRouter();

    const startConversation = async () => {
        if (userId) {
            const conversation = await apiService.get(`/api/v1/chat/start/${landlordId}/`)

            if (conversation.conversation_id){
                router.push(`/inbox/${conversation.conversation_id}`)
            }
        }else {
            loginModal.open();
        }
    }

    return (
        <div 
            onClick={startConversation}
            className="cursor-pointer mt-6 py-4 px-6 bg-red-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
            Contact
        </div>
        
    )
}

export default ContactsButton;