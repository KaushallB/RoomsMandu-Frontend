const SearchFilter = () =>{
    return (
        <div className="h-[48px] lg:h-[64] flex flex-row items-center justify-between rounded-full">
            <div className="hidden lg:block">
                <div className="flex flex-row items-center justify-between">
                    <div className="cursor-pointer w-[250px] h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-red-500">
                        <p className="text-xs font-semibold">Where</p>
                        <p className="text-sm">Wanted Location</p>
                    </div>

                    <div className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-red-500">
                        <p className="text-xs font-semibold">Check In</p>
                        <p className="text-sm">Add Dates</p>
                    </div>


                    <div className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-red-500">
                        <p className="text-xs font-semibold">Check Out</p>
                        <p className="text-sm">Add Dates</p>
                    </div>

                    <div className="cursor-pointer h-[48px] lg:h-[64] px-8 flex flex-col justify-center rounded-full hover:bg-red-500">
                        <p className="text-xs font-semibold">Who</p>
                        <p className="text-sm">Add Guests</p>
                    </div>
                </div>
            </div>
        
        <div className="p-2">
            <div className="cursor-pointer p-2 lg:p-4 bg-blue-800 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>
        </div>
    </div>
    )
}

export default SearchFilter;