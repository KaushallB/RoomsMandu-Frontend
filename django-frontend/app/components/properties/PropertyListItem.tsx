import Link from 'next/link';
import Image from 'next/image';
import { PropertyType } from "./PropertyLists";
import {useRouter} from 'next/navigation';
import FavouriteButton from './FavouriteButton';

interface PropertyProps {
    property: PropertyType
    markFav?: (is_favourite: boolean) => void;
    userId?: string | null;
}


const PropertyListItem: React.FC<PropertyProps> = ({
    property,
    markFav,
    userId
}) => {

    const router = useRouter();

    return (
    <div className="cursor-pointer"
        onClick={() => router.push(`/properties/${property.id}`)}
        >
        <div className="relative overflow-hidden aspect-square rounded-xl">
            <Image fill
                src={property.image_url}
                // src='/house1.jpg'
                
                alt={property.title}
                sizes="(max-width:768 px) 768 px, (max-width: 1200px): 768px, 768px" 
                className="hover:scale-110 object-cover transition h-full w-full" 
            />

            {/* Availability Badge */}
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                property.is_available 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
            }`}>
                {property.is_available ? 'Available' : 'Rented'}
            </div>

            {userId && (
                <FavouriteButton 
                    id={property.id}
                    is_favourite={property.is_favourite}
                    markFav={(is_favourite) => markFav && markFav(is_favourite)}
                />
            )}
        </div>

        <div className="mt-2">
            <p className="text-lg font-bold"> {property.title} </p>
            <p className="mt-2 text-sm text-gray-500"><strong>Rs {property.price_per_month} </strong> per month  </p>
        </div>

        <div className="mt-2">
            <p className="text-sm text-gray-500 flex items-center gap-1">
                {property.address}, {property.district}
            </p>
        </div>


    </div>

    )
}

export default PropertyListItem;