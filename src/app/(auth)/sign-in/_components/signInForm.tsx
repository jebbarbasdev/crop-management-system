'use client'

import { useForm } from 'react-hook-form';
import { signInFormSchema, SignInFormSchema } from '../_models/signInFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import DaisyInput from '@/app/_components/DaisyInput';
import { signInAction } from '../actions';
import { toast } from 'sonner';
import TitledForm from '@/app/_components/TitledForm';
import Link from 'next/link';

export default function SignInForm() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({ resolver: zodResolver(signInFormSchema) })

    const signIn = async (data: SignInFormSchema) => {
        const errorMessage = await signInAction(data)
        toast.error(errorMessage)
    }

    return (
        <TitledForm title="Iniciar Sesión">
            <form onSubmit={handleSubmit(signIn)} className="flex flex-col gap-4 w-full">
                <DaisyInput
                    type="text"
                    placeholder="Correo Electrónico"

                    label="Correo Electrónico"
                    error={errors.email?.message}

                    {...register('email')}
                />
                
                <DaisyInput
                    type="password"
                    placeholder="Contraseña"

                    label="Contraseña"
                    error={errors.password?.message}

                    {...register('password')}
                />

                <button className="btn btn-primary">Iniciar Sesión</button>

                <div className='text-sm text-center'>
                    <span>¿Olvidaste tu contraseña?{' '}</span>
                    <Link href="/forgot-password" className='link link-primary'>
                        Restablecer Contraseña
                    </Link>
                </div>
            </form>
        </TitledForm>
    );
}