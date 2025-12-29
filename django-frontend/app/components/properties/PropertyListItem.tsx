import Link from 'next/link';
import Image from 'next/image';
import { PropertyType } from "./PropertyLists";
import {useRouter} from 'next/navigation';

interface PropertyProps {
    property: PropertyType
}


const PropertyListItem: React.FC<PropertyProps> = ({
    property
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
                
                alt='house1'
                sizes="(max-width:768 px) 768 px, (max-width: 1200px): 768px, 768px" 
                className="hover:scale-110 object-cover transition h-full w-full" 
            />
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