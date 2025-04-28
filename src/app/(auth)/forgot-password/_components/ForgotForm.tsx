'use client'

import { useForm } from 'react-hook-form';
import { forgotPasswordSchema, ForgotPasswordSchema } from '../_models/forgotPasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import DaisyInput from '@/app/_components/DaisyInput';
//import { signInAction } from '../actions';
import { toast } from 'sonner';
import TitledForm from '@/app/_components/TitledForm';
import Link from 'next/link';
import { forgotPasswordAction } from '../actions';
import DaisyButton from '@/app/_components/DaisyButton';

export default function ForgotForm() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        reset
    } = useForm({ resolver: zodResolver(forgotPasswordSchema) })

    const forgotPassword = async (data: ForgotPasswordSchema) => {
        const errorMessage = await forgotPasswordAction(data)
        
        if (errorMessage) {
            toast.error(errorMessage)
        }
        else {
            toast.success('Se ha enviado un correo electrónico para restablecer tu contraseña.')
            reset()
        }        
    }

    return (
        <TitledForm title="Recuperar Contraseña">
            <form onSubmit={handleSubmit(forgotPassword)} className="flex flex-col gap-4 w-full">
                <DaisyInput
                    type="text"
                    placeholder="Correo Electrónico"

                    label="Correo Electrónico"
                    error={errors.email?.message}

                    disabled={isSubmitting}

                    {...register('email')}
                />

                <DaisyButton variant="primary" loading={isSubmitting}>Recuperar Contraseña</DaisyButton>

                <div className='text-sm text-center'>
                    <span>¿Recordaste tu contraseña?{' '}</span>
                    <Link href="/sign-in" className='link link-primary'>
                        Iniciar Sesión
                    </Link>
                </div>
            </form>
        </TitledForm>
    );
}