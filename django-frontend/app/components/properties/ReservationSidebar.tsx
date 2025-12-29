export type Property = {
    id:string;
    price_per_month: number;
}

interface ReservationSidebarProps {
    property: Property
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({
    property
}) => {
    return (
       <aside className="mt-6 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
        <h2 className="mb-5 text-2xl"> Rs {property.price_per_month} per month</h2>
        
        <div className="mb-6 p-3 border border-gray-400 rounded-xl">
            <label className="mb-2 block font-bold text-xs"> Members </label>

            <select className="w-full -ml-1 text-xm">
                <option>1 </option>
                <option>2 </option>
                <option>3 </option>
                <option>4 </option>
            </select>
        </div>
        
        <div className="w-full mb-6 py-6 text-center text-white bg-red-500 hover:bg-blue-500 rounded-xl">
            Schedule Visit / Book
        </div>

        <div className="mb-4 flex justify-between align-center">
            <p> Rs 15000 per month </p>

            <p> Rs 5000 advance </p>
        </div>

        <div className="mb-4 flex justify-between align-center">
            <p> Django Fee </p>

            <p> Rs 5000  </p>
        </div>

        <hr />

        <div className="mt-4 flex justify-between align-center font-bold">
            <p> Django Fee </p>

            <p> 10000  </p>
        </div>      


       </aside>
    )
}

export default ReservationSidebar;