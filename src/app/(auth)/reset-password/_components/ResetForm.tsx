'use client'

import { useForm } from 'react-hook-form';
import { resetSchema, ResetSchema } from '../_models/resetSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import DaisyInput from '@/app/_components/DaisyInput';
import { resetPasswordAction } from '../actions';
import { toast } from 'sonner';
import TitledForm from '@/app/_components/TitledForm';
import DaisyButton from '@/app/_components/DaisyButton';

export default function ResetForm() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm({ resolver: zodResolver(resetSchema) })

    const resetPassword = async (data: ResetSchema) => {
        const errorMessage = await resetPasswordAction(data)
        toast.error(errorMessage)
    }

    return (
        <TitledForm title="Restablecer Contraseña">
            <form onSubmit={handleSubmit(resetPassword)} className="flex flex-col gap-4 w-full">
                <DaisyInput
                    type="password"
                    placeholder="Nueva Contraseña"

                    label="Nueva Contraseña"
                    error={errors.password?.message}

                    {...register('password')}
                />
                
                <DaisyInput
                    type="password"
                    placeholder="Confirmar Contraseña"

                    label="Confirmar Contraseña"
                    error={errors.confirmPassword?.message}

                    {...register('confirmPassword')}
                />

                <DaisyButton variant="primary" loading={isSubmitting}>Restablecer Contraseña</DaisyButton>
            </form>
        </TitledForm>
    );
}