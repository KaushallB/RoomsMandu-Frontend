'use client';

import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface SingleDatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
}

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
    value,
    onChange
}) => {
    return (
        <Calendar
            className="w-full border border-gray-400 rounded-xl"
            color="#262626"
            date={value}
            onChange={onChange}
            minDate={new Date()}
        />
    );
};

export default SingleDatePicker;
