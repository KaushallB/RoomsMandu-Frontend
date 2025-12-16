import Image from 'next/image';
import ReservationSidebar from '../../components/properties/ReservationSidebar';



const PropertyDetails = () => {
    return (
        <main className="max-w-1500px mx-auto px-6 pb-6">
            <div className="w-full h-[80vh] mb-4 overflow-hidden rounded-xl relative">
                <Image fill
                    src='/house1.jpg'
                    className="object-cover w-full h-full"
                    alt="House1"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="py-6 pr-6 col-span-3">
                    <h1 className="mb-4 text-4xl"> Property Name</h1>
                    <span className="mb-6 block text-lg text-gray-600">
                        3 Bedrooms- 1 kitchen 1- Attached Toilets
                    </span>

                    <hr />
                <div className="py-6 flex items-center space-x-4">
                    <Image src='/pp.jpg'
                        width={50}
                        height={50}
                        className="rounded-full" 
                        alt="Owner's Name"
                    />

                    <p><strong>Ram </strong></p>
                </div>

                <hr />
            
                <p className="mt-6 text-lg">
                    GreatHouse Lorem asdasdasd
                </p>
            </div>



                <ReservationSidebar />

            </div>
        </main>
    )

}

export default PropertyDetails;