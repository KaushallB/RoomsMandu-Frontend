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
        </div>

        <div className="mt-2">
            <p className="text-sm text-gray-500"><strong> {property.price_per_month} </strong> per month  </p>
        </div>


    </div>

    )
}

export default PropertyListItem;