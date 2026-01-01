import { create } from 'zustand';

interface VideoCallModalStore {
    isOpen: boolean;
    propertyId: string;
    landlordId: string;
    open: (propertyId: string, landlordId: string) => void;
    close: () => void;
}

const useVideoCallModal = create<VideoCallModalStore>((set) => ({
    isOpen: false,
    propertyId: '',
    landlordId: '',
    open: (propertyId, landlordId) => set({ isOpen: true, propertyId, landlordId }),
    close: () => set({ isOpen: false, propertyId: '', landlordId: '' })
}));

export default useVideoCallModal;
