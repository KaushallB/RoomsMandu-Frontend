import infoNepal from 'info-nepal';

export interface District {
    label: string;
    value: string;
}

const useDistricts = () => {
    // Get all districts formatted for react-select
    const getAll = (): District[] => {
        try {
            const districts = infoNepal.allDistricts || [];
            return districts.map((districtName: string) => ({
                label: districtName,
                value: districtName
            }));
        } catch (error) {
            console.error('Error loading districts:', error);
            return [];
        }
    };

    // Get districts by province
    const getByProvince = (provinceId: number): District[] => {
        try {
            const districts = infoNepal.districtsOfProvince?.[provinceId] || [];
            return districts.map((districtName: string) => ({
                label: districtName,
                value: districtName
            }));
        } catch (error) {
            console.error('Error loading districts by province:', error);
            return [];
        }
    };

    return {
        getAll,
        getByProvince
    };
};

export default useDistricts;
