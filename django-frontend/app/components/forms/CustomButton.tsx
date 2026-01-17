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
            className={`w-full py-4 bg-blue-500 hover:bg-red-600 text-white rounded-xl transition text-center cursor-pointer ${className}`}
        >
            {label}
        </div>
        
    )
}

export default CustomButton;