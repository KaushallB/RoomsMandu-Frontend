'use client';

import Modal from './Modal';
import useAddPropertyModal from '@/app/hooks/useAddPropertyModal';
import CustomButton from '../forms/CustomButton';
import { useState } from 'react';

const AddPropertyModal = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const addPropertymodal = useAddPropertyModal();
    
    console.log('AddPropertyModal rendered, isOpen:', addPropertymodal.isOpen);
    
    const content = (
        <>
            {currentStep === 1 ? (
                <>
                    <h2 className='mb-6 text-2xl'>Choose Category</h2>

                    <CustomButton 
                        label='Next'
                        onClick={() => setCurrentStep(2)}
                    />
                </>
            ) : (
                <p>Step 2</p>
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