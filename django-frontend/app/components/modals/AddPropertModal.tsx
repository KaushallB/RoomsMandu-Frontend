'use client';

import Modal from './Modal';
import useAddPropertyModal from '@/app/hooks/useAddPropertyModal';
import CustomButton from '../forms/CustomButton';
import { ChangeEvent, useState } from 'react';
import Categories from '../addproperty/Categories';
import SelectDistrict, { SelectDistrictValue } from '../forms/selectDistrict';
import Image from 'next/image';
import apiService from '@/app/services/apiService';
import {useRouter} from 'next/navigation';

const AddPropertyModal = () => {
    const addPropertymodal = useAddPropertyModal();
    const Router = useRouter();
    //states
    const [currentStep, setCurrentStep] = useState(1);
    const [dataCategory, setdataCategory] = useState('');
    const [dataTitle, setdataTitle] = useState('');
    const [dataDescription, setdataDescription] = useState('');
    const [dataPrice, setdataPrice] = useState('');
    const [dataRooms, setdataRooms ] = useState('');
    const [dataBathrooms, setdataBathrooms] = useState('');
    const [dataKitchen, setdataKitchen] = useState('');
    const [dataDistrict, setdataDistrict] = useState<SelectDistrictValue>();
    const [dataImage, setdataImage] = useState< File | null >(null);
    const [dataAddress, setdataAddress] = useState('');
    const [dataLatitude, setdataLatitude] = useState('');
    const [dataLongitude, setdataLongitude] = useState('');
    const [gettingLocation, setGettingLocation] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);


    console.log('AddPropertyModal rendered, isOpen:', addPropertymodal.isOpen);

    //set datas

    const setCategory = (category: string) => {
        setdataCategory(category)
    }

    const setImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0){
            const tmpImage= event.target.files[0];

            setdataImage(tmpImage);
        }
    }

    // Get current location using browser GPS
    const getMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Round to 6 decimal places (about 10cm accuracy, fits in DB)
                setdataLatitude(position.coords.latitude.toFixed(6));
                setdataLongitude(position.coords.longitude.toFixed(6));
                setGettingLocation(false);
            },
            (error) => {
                alert('Unable to get location. Please enter manually or try again.');
                setGettingLocation(false);
            }
        );
    };

    //Submit

    const submitForm = async () => {
        console.log('SubmittedForm');

        if (
            dataCategory &&
            dataTitle &&
            dataDescription &&
            dataPrice &&
            dataDistrict &&
            dataImage
        ) {
            const formData = new FormData();
            formData.append('category', dataCategory);
            formData.append('title', dataTitle);
            formData.append('description', dataDescription);
            formData.append('price_per_month', dataPrice);
            formData.append('rooms', dataRooms);
            formData.append('bathrooms', dataBathrooms);
            formData.append('kitchen', dataKitchen);
            formData.append('district', dataDistrict.value);
            formData.append('image', dataImage);
            
            // Add location fields
            if (dataAddress) formData.append('address', dataAddress);
            if (dataLatitude) formData.append('latitude', dataLatitude);
            if (dataLongitude) formData.append('longitude', dataLongitude);

            const response = await apiService.post('/api/v1/properties/create/', formData);
            
            console.log('Full response:', response);

            // Check if property was created (status 201 or has id)
            if (response.id || response.success) {
                console.log('Property created successfully');

                Router.push('/?added=true');

                addPropertymodal.close();
                
                // Reset form
                setCurrentStep(1);
                setdataCategory('');
                setdataTitle('');
                setdataDescription('');
                setdataPrice('');
                setdataRooms('');
                setdataBathrooms('');
                setdataKitchen('');
                setdataDistrict(undefined);
                setdataImage(null);
                setdataAddress('');
                setdataLatitude('');
                setdataLongitude('');
            } else {
                console.error('Error creating property:', response);

                const tmpErrors: string[] = Object.values(response).map((error: any) => {
                    return error;
                })
                setErrors(tmpErrors);
            }
        } 
    }
    
    const content = (
        <>
            {currentStep === 1 ? (
                <>
                    <h2 className='mb-6 text-2xl'>Choose Category</h2>

                    <Categories 
                        dataCategory={dataCategory}
                        setCategory={(category) => setCategory(category)}
                        />

                    {!dataCategory && (
                        <p className='text-red-500 text-sm mt-2'>Please select a category</p>
                    )}

                    <CustomButton 
                        label='Next'
                        onClick={() => {
                            if (dataCategory) {
                                setCurrentStep(2);
                            }
                        }}
                    />
                </>
            ) : currentStep == 2 ? (
                <>
                    <h2 className='mb-6 text-2xl'> Describe your preference </h2>

                    <div className='pt-3 pb-6 space-y-4'>
                        <div className='flex flex-col space-y-2'>
                            <label>Title</label>
                            <input 
                                type='text'
                                value={dataTitle}
                                onChange={(e) => setdataTitle(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                                />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Descrtiption</label>
                            <textarea
                                value={dataDescription}
                                onChange={(e) => setdataDescription(e.target.value)}
                                className='w-full h-[200px] p-4 border border-gray-600 rounded-xl'
                            ></textarea>
                        </div>

                    </div>

                    {(!dataTitle || !dataDescription) && (
                        <p className='text-red-500 text-sm mb-2'>Please fill all fields</p>
                    )}

                    <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(1)}
                    />

                    <CustomButton 
                        label='Next'
                        onClick={() => {
                            if (dataTitle && dataDescription) {
                                setCurrentStep(3);
                            }
                        }}
                    />
                </>
            ) : currentStep == 3 ? (
                <>

                <h2 className='mb-6 text-2xl'> Details </h2>

                    <div className='pt-3 pb-6 space-y-4'>
                        <div className='flex flex-col space-y-2'>
                            <label>Price per Month</label>
                            <input 
                                type='number'
                                value={dataPrice}
                                onChange={(e) => setdataPrice(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Rooms</label>
                            <input 
                                type='number'
                                value={dataRooms}
                                onChange={(e) => setdataRooms(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                                />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Bathrooms</label>
                            <input 
                                type='number'
                                value={dataBathrooms}
                                onChange={(e) => setdataBathrooms(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                                />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label>Kitchen</label>
                            <input 
                                type='number'
                                value={dataKitchen}
                                onChange={(e) => setdataKitchen(e.target.value)}
                                className='w-full p-4 border border-gray-600 rounded-xl'
                                />
                        </div>
                    </div>

                {!dataPrice && (
                    <p className='text-red-500 text-sm mb-2'>Please enter price per month</p>
                )}

                <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(2)}
                    />

                    <CustomButton 
                        label='Next'
                        onClick={() => {
                            if (dataPrice) {
                                setCurrentStep(4);
                            }
                        }}
                    />
                
                </>
            ) : currentStep == 4 ? (
            
            <>

                <h2 className='mb-6 text-2xl'> Location </h2>

                <div className='pt-3 pb-6 space-y-4'>
                    <SelectDistrict 
                        value = {dataDistrict}
                        onChange={(value) => setdataDistrict(value as SelectDistrictValue)}
                    />

                    <div className='flex flex-col space-y-2'>
                        <label>Full Address</label>
                        <input 
                            type='text'
                            value={dataAddress}
                            onChange={(e) => setdataAddress(e.target.value)}
                            placeholder='Street name, Landmark, Area...'
                            className='w-full p-4 border border-gray-600 rounded-xl'
                        />
                    </div>

                    {/* GPS Location */}
                    <div className='p-4 bg-gray-50 rounded-xl space-y-3'>
                        <p className='text-sm text-gray-600'>📍 Add GPS location </p>
                        
                        <button
                            type='button'
                            onClick={getMyLocation}
                            disabled={gettingLocation}
                            className='w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50'
                        >
                            {gettingLocation ? 'Getting Location...' : '📍 Get My Current Location'}
                        </button>

                        {(dataLatitude && dataLongitude) && (
                            <div className='text-sm text-green-600 text-center'>
                                Location captured! ({parseFloat(dataLatitude).toFixed(4)}, {parseFloat(dataLongitude).toFixed(4)})
                            </div>
                        )}

                        <div className='grid grid-cols-2 gap-2'>
                            <input 
                                type='text'
                                value={dataLatitude}
                                onChange={(e) => setdataLatitude(e.target.value)}
                                placeholder='Latitude'
                                className='p-2 border rounded-lg text-sm'
                            />
                            <input 
                                type='text'
                                value={dataLongitude}
                                onChange={(e) => setdataLongitude(e.target.value)}
                                placeholder='Longitude'
                                className='p-2 border rounded-lg text-sm'
                            />
                        </div>
                    </div>

                </div>

                {!dataDistrict && (
                    <p className='text-red-500 text-sm mb-2'>Please select a district</p>
                )}

                <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(3)}
                    />

                <CustomButton 
                        label='Next'
                        onClick={() => {
                            if (dataDistrict) {
                                setCurrentStep(5);
                            }
                        }}
                    />
            
            </>
            ) : (
            <>

                <h2 className='mb-6 text-2xl'> Image </h2>

                <div className='pt-3 pb-6 space-y-4'>
                    <label className='block py-4 px-6 bg-gray-200 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-300 transition'>
                        <input
                            type="file"
                            accept='image/*' 
                            onChange={setImage}
                            className='hidden'
                        />
                        <span className='inline-block py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition'>
                            Choose file
                        </span>
                        <span className='ml-3'>
                            {dataImage ? dataImage.name : 'No file chosen'}
                        </span>
                    </label>

                        {dataImage && (
                            <div className='w-[200px] h-[150px] relative'>
                                <Image 
                                    fill
                                    alt="Uploaded Image"
                                    src={URL.createObjectURL(dataImage)}
                                    className='w-full h-full object-cover rounded-xl'
                                />
                            </div>
                    )}

                </div>

                {errors.map((error, index) => {
                    return (
                        <div
                            key={index}
                            className='p-5 mb-4 bg-red-500 text-white rounded-xl opacity-80'
                        >
                            {error}
                        </div>
                    )
                })}

                <CustomButton
                        label='Previous'
                        className='mb-2 bg-black hover:bg-gray-800'
                        onClick={() => setCurrentStep(4)}
                    />

                <CustomButton 
                        label='Submit'
                        onClick={submitForm}
                    />
            
            </>
            )}
        </>
    );

    return (
        <Modal 
            isOpen={addPropertymodal.isOpen}
            close={addPropertymodal.close}
            label="Add property"
            content={content}
        />
    )
}

export default AddPropertyModal;