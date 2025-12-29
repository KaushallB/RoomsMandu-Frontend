'use client';

import apiService from "@/app/services/apiService";

interface FavorutieButtonProps {
    id: string;
    is_favourite: boolean;
    markFav: (is_favourite: boolean) => void;
}

const FavouriteButton: React.FC<FavorutieButtonProps> = ({
    id,
    is_favourite,
    markFav
}) => {
    const toggleFavourite = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const response = await apiService.post(`/api/v1/properties/${id}/toggle_favourites/`, {})

        markFav(response.is_favourite || response.Is_favourite)
    }

    return (
        <div 
            onClick={toggleFavourite}
            className={`absolute top-2 right-2 cursor-pointer transition p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 ${is_favourite ? 'text-yellow-500' : 'text-white'} hover:text-yellow-400`}
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill={is_favourite ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>

        </div>
    )
}

export default FavouriteButton;