'use client';

import Select from 'react-select';
import useDistricts from '@/app/hooks/useDistricts';

export type SelectDistrictValue = {
    label:string;
    value:string;
}

interface SelectDistrictProps {
    value?: SelectDistrictValue;
    onChange: (value: SelectDistrictValue) => void;
}

const SelectDistrict: React.FC<SelectDistrictProps> = ({
    value,
    onChange
}) => {

    const { getAll } = useDistricts();

    return (
        <Select 
            isClearable
            placeholder="Anywhere"
            options={getAll()}
            value={value}
            onChange={(value) => onChange(value as SelectDistrictValue)}
        />
    )
}

export default SelectDistrict;