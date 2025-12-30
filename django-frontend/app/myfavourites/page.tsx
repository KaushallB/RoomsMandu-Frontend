import PropertyList from "../components/properties/PropertyLists";
import { getUserId } from "../lib/actions";

const MyFavouritesPage = async () => {
    const userId = await getUserId();

    if (!userId){
        return (
            <main className='max-w-[1500px] max-auto px-6 py-12'>
                <p> You need to be Authenticated...</p>
            </main>
        )
    }

    return (
         <main className='max-w-[1500px] max-auto px-6 pb-12'>
               <h1 className="my-6 text-2xl">My Favourites</h1>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PropertyList
                    favourites={true}
                    userId={userId}
                />
               </div>
            </main>
    )
}

export default MyFavouritesPage;