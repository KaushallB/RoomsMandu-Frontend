import Image from 'next/image';

const MyReservationsPage = () => {
    return (
        <main className="max-w-1500px mx-auto px-6 pb-6">
            <h1 className='my-6 text-2xl'>Reservation</h1> 

            <div className='space-y-4'>
                <div className='p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl'>
                    <div className='col-span-1'>
                        <div className='relative overflow-hidden aspect-square rounded-xl'>
                            <Image 
                                fill
                                src='/house1.jpg'
                                alt='House 1'
                                className='hover:scale-110 object-cover transition h-full w-full'
                                />
                        </div>
                    </div>

                    <div className='col-span-1 md:col-span-3 space-y-2'>
                        <h2 className='mb-4 text-xl'>Property Name</h2>
                        <p className='mb-2'><strong>Booking Date:</strong> 16/12/2025</p>

                        <p className='mb-2'><strong>Advance:</strong> Rs 5000</p>

                        <p className='mb-2'><strong>Total Price:</strong> Rs 10000</p>

                        <div className='mt-6 inline-block cursor-pointer py-4 px-6 bg-red-400 text-white rounded-xl'>Go To Property</div>
                    </div>
                    
                </div>
                <div className='p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl'>
                    <div className='col-span-1'>
                        <div className='relative overflow-hidden aspect-square rounded-xl'>
                            <Image 
                                fill
                                src='/house1.jpg'
                                alt='House 1'
                                className='hover:scale-110 object-cover transition h-full w-full'
                                />
                        </div>
                    </div>

                    <div className='col-span-1 md:col-span-3 space-y-2'>
                        <h2 className='mb-4 text-xl'>Property Name</h2>
                        <p className='mb-2'><strong>Booking Date:</strong> 16/12/2025</p>

                        <p className='mb-2'><strong>Advance:</strong> Rs 5000</p>

                        <p className='mb-2'><strong>Total Price:</strong> Rs 10000</p>

                        <div className='mt-6 inline-block cursor-pointer py-4 px-6 bg-red-400 text-white rounded-xl'>Go To Property</div>
                    </div>
                    
                </div>
            </div>
        </main>
    )
}

export default MyReservationsPage;