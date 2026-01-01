'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropertyListItem from './PropertyListItem';
import apiService from '@/app/services/apiService';
import useSearchModal from '@/app/hooks/useSearchModal';
import { useSearchParams } from 'next/navigation';

export type PropertyType = {
    id: string;
    title: string;
    price_per_month: number;
    image_url: string;
    is_favourite: boolean;
    district: string;
    address: string;
    is_available: boolean;
}

interface PropertyListProps {
    landlord_id?: string | null;
    userId?: string | null;
    favourites?: boolean | null;
}

const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id,
    userId,
    favourites
}) =>{

    const params = useSearchParams();
    const [properties, setProperties] = useState<PropertyType[]>([]);

    const searchModal = useSearchModal();
    const district = searchModal.query.district || '';
    const selectedCategory = searchModal.query.category || '';
    const budgetRange = searchModal.query.budget || '';
    const numRooms = searchModal.query.rooms || 0;
    const numKitchen = searchModal.query.kitchen || 0;
    const numBathrooms = searchModal.query.bathroom || 0;

    const markFav = (id:string, is_favourite: boolean) => {
        const tmpProperties = properties.map((property: PropertyType) => {
            if (property.id == id) {
                property.is_favourite = is_favourite
            }
            return property;
        })
        setProperties(tmpProperties)
    }

    const getProperties = async () => {
        let url = '/api/v1/properties/';
        
        if (landlord_id) {
            url += `?landlord_id=${landlord_id}`
        }else if(favourites){
            url += '?is_favourites=true'
        } else {
            let urlQuery = '';

            if (district) {
                urlQuery += '&district=' + district
            }

            if (selectedCategory) {
                urlQuery += '&selectedCategory=' + selectedCategory
            }

            if(budgetRange){
                urlQuery += '&budgetRange=' + budgetRange
            }

            if(numRooms){
                urlQuery += '&numRooms=' + numRooms
            }

            if(numKitchen){
                urlQuery += '&numKitchen=' + numKitchen
            }

            if(numBathrooms){
                urlQuery += '&numBathrooms=' + numBathrooms
            }

            if(urlQuery.length){
                urlQuery = '?' + urlQuery.substring(1);
                url += urlQuery;
            }
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
    },[landlord_id, favourites, district, selectedCategory, budgetRange, numRooms, numKitchen, numBathrooms, params]);

    return (
        <>
        {properties.map((property) => {
            return (
                <PropertyListItem 
                    key={property.id}
                    property={property}
                    markFav={(is_favourite: any) => markFav(property.id, is_favourite)}  userId={userId}/>
            )
        })}
        </>
    )
}

export default PropertyList;