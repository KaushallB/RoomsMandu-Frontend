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
    is_favourite: boolean;
}

interface PropertyListProps {
    landlord_id?: string | null;
    userId?: string | null;
}
const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id,
    userId
}) =>{
    const [properties, setProperties] = useState<PropertyType[]>([]);

    const markFav = (id:string, is_favourite: boolean) => {
        const tmpProperties = properties.map((property: PropertyType) => {
            if (property.id == id) {
                property.is_favourite = is_favourite

                if (is_favourite) {
                    console.log('added list to favourite properties')
                } else {
                    console.log('Removed from list')
                }
            }

            return property;
        })

        setProperties(tmpProperties)
    }

    const getProperties = async () => {
        let url = '/api/v1/properties/';
        
        if (landlord_id) {
            url += `?landlord_id=${landlord_id}`
        }

        const tmpProperties = await apiService.get(url);

        setProperties(tmpProperties.data.map((property: PropertyType) => {
            if (tmpProperties.favourites.includes(property.id)){
                property.is_favourite = true
            } else {
                property.is_favourite = false
            }

            return property
        }));
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
                    markFav={(is_favourite: any) => markFav(property.id, is_favourite)}                    userId={userId}                />
            )
        })}
        </>
    )
}

export default PropertyList;