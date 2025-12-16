interface CustomButtonProps{
    label:string;
    onClick: () => void;
    className?: string;
}
const CustomButton: React.FC<CustomButtonProps> = ({
    label, 
    onClick,
    className
}) => {
    return (
        <div 
            onClick={onClick}
            className={`px-4 py-2 bg-red-500 hover:bg-blue-600 text-white rounded-xl transition text-center cursor-pointer ${className}`}
        >
            {label}
        </div>
        
    )
}

export default CustomButton;