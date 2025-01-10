import React from 'react';
interface AddDietFormProps {
    patientId: string;
    onSubmit: (data: any) => void;
    onClose: () => void;
}
export declare const AddDietForm: React.FC<AddDietFormProps>;
export {};
