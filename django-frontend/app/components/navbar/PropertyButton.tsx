'use client';
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import useLoginModal from "@/app/hooks/useLoginModal";

interface AddPropertyButtonProps {
    userId?: string | null;
}

const AddProperty: React.FC<AddPropertyButtonProps> = ({
    userId
}) => {
    const loginModal = useLoginModal();
    const addPropertyModal = useAddPropertyModal();
    
    const handleClick = () => {
        if (userId) {
            console.log('Button clicked, opening modal...');
            addPropertyModal.open();
        } else {
            loginModal.open();
        }
    }

    return (
        <div 
            onClick={handleClick}
            className="p-2 px-4 cursor-pointer text-sm font-semibold rounded-full border border-gray-300 hover:bg-gray-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Property
        </div>
    )
}

export default AddProperty;