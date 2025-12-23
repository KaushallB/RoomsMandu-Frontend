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
            className="p-2 cursor-pointer text-sm font-semibold rounded-full hover:bg-red-500">
            Django, Your Home
        </div>
    )
}

export default AddProperty;