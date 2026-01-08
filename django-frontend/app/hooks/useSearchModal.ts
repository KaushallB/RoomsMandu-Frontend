import {create} from "zustand";

export type SearchQuery = {
    district: string | undefined;
    category: string;
    budget: string;
    rooms: Number;
    bathroom: Number;
    kitchen: Number;
}


interface SearchModalStore{
    step: string;
    isOpen: boolean;
    open: (step: string) => void;
    close: () => void;
    query: SearchQuery;
    setQuery: (query: SearchQuery) => void;
}

const useSearchModal = create<SearchModalStore>((set) => ({
    step: '',
    isOpen: false,
    open: (step) => set({ isOpen:true, step: step}),
    close: () => set({ isOpen: false }),
    setQuery: (query: SearchQuery) => set({query: query}),
    query: {
        district: '',
        category: null,
        budget: null,
        rooms: 0,
        bathroom: 0,
        kitchen: 0
    }
}));

export default useSearchModal;