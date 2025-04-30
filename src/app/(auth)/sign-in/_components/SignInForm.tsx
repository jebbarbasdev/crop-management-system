'use client'

import { useForm } from 'react-hook-form';
import { signInFormSchema, SignInFormSchema } from '../_models/signInFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import DaisyInput from '@/app/_components/DaisyInput';
import { signInAction } from '../actions';
import { toast } from 'sonner';
import TitledForm from '@/app/_components/TitledForm';
import Link from 'next/link';
import DaisyButton from '@/app/_components/DaisyButton';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function WithFallbackForm() {
    const searchParams = useSearchParams()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(signInFormSchema) })

    const signIn = async (data: SignInFormSchema) => {
        const errorMessage = await signInAction(data, searchParams.get('redirectTo'))
        toast.error(errorMessage)
    }

    return (
        <form onSubmit={handleSubmit(signIn)} className="flex flex-col gap-4 w-full">
            <DaisyInput
                type="text"
                placeholder="Correo Electrónico"

                label="Correo Electrónico"
                error={errors.email?.message}

                disabled={isSubmitting}

                {...register('email')}
            />

            <DaisyInput
                type="password"
                placeholder="Contraseña"

                label="Contraseña"
                error={errors.password?.message}

                disabled={isSubmitting}

                {...register('password')}
            />

            <DaisyButton variant="primary" loading={isSubmitting}>Iniciar Sesión</DaisyButton>

            <div className='text-sm text-center'>
                <span>¿Olvidaste tu contraseña?{' '}</span>
                <Link href="/forgot-password" className='link link-primary'>
                    Recuperar Contraseña
                </Link>
            </div>
        </form>
    )
}

export default function SignInForm() {
    // Lo del Suspense > WithFallbackForm es porque NextJS me pide eso al usar useSearchParams

    return (
        <TitledForm title="Iniciar Sesión">
            <Suspense>
                <WithFallbackForm />
            </Suspense>
        </TitledForm>
    );
}