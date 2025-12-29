'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropertyListItem from './PropertyListItem';
import apiService from '@/app/services/apiService';

export type PropertyType = {
    id: string;
    title: string;
    price_per_month: number;
    image_url: string;
}

interface PropertyListProps {
    landlord_id?: string | null;
}
const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id
}) =>{
    const [properties, setProperties] = useState<PropertyType[]>([]);

    const getProperties = async () => {
        let url = '/api/v1/properties/';
        
        if (landlord_id) {
            url += `?landlord_id=${landlord_id}`
        }

        const tmpProperties = await apiService.get(url);

        setProperties(tmpProperties.data);
    };

    //     await fetch(url, {
    //         method: 'GET',
    //     })
    //         .then(response => response.json())
    //         .then ((json) => {
    //             console.log('json',json);

    //             setProperties(json.data)
    //         })
    //         .catch((error) => {
    //             console.log('error:',error);
    //         })
    // };

    useEffect(()=>{
        getProperties();
    },[landlord_id]);

    return (
        <>
        {properties.map((property) => {
            return (
                <PropertyListItem 
                    key={property.id}
                    property={property}
                />
            )
        })}
        </>
    )
}

export default PropertyList;