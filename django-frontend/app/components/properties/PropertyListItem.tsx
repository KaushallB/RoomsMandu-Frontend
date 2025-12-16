import Link from 'next/link';
import Image from 'next/image';


const PropertyListItem = () =>{
    return (
      <div className="cursor-pointer">
        <div className="relative overflow-hidden aspect-square rounded-xl">
            <Image fill
                src='/house1.jpg'
                alt='house1'
                sizes="(max-width:768 px) 768 px, (max-width: 1200px): 768px, 768px" 
                className="hover:scale-110 object-cover transition h-full w-full" 
            />
        </div>

        <div className="mt-2">
            <p className="text-lg font-bold"> Property Name </p>
        </div>

         <div className="mt-2">
            <p className="text-sm text-gray-500"><strong> Rs 15000 </strong> per month  </p>
        </div>


    </div>

    )
}

export default PropertyListItem;