interface CustomButtonProps {
    label: string;
    onClick: () => void;
    className?: string;
}
const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    onClick,
    className
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full py-4 rounded-xl transition text-center cursor-pointer font-semibold ${className}`}
        >
            {label}
        </button>
    );
};

export default CustomButton;