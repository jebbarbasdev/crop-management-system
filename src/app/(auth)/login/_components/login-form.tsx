'use client'

import { Button, Paper, PasswordInput, TextInput, Title, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { loginFormSchema, LoginFormSchema } from '../_models/loginFormSchema';
import { showNotification } from '@mantine/notifications';
import { redirect } from 'next/navigation';

import css from './login-form.module.css'

export default function LoginForm() {
    const form = useForm<LoginFormSchema>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: ''
        },
        validate: zodResolver(loginFormSchema)
    })

    const handleSubmit = (values: LoginFormSchema) => {
        if (values.password === "dummypassword") {
            redirect('/')
        }
        else {
            showNotification({
                title: 'Error',
                message: 'Correo electrónico o contraseña incorrectos',
                color: 'red'
            })
        }
    }

    return (
        <Paper className={css.form} radius={0} p={30}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Title className={css.title} order={2} ta="center" my="md">
                    ¡Bienvenido a Crop MS!
                </Title>

                <Text ta="center" my="md">
                    Ingresa tu correo electrónico y contraseña para iniciar sesión
                </Text>

                <TextInput label="Correo Electrónico" placeholder="hello@gmail.com" size="md" {...form.getInputProps('email')} />
                
                <PasswordInput label="Contraseña" placeholder="Your password" mt="md" size="md" {...form.getInputProps('password')} />
                
                <Button fullWidth mt="xl" size="md" type="submit">
                    Iniciar Sesión
                </Button>

                <Text ta="center" mt="md">
                    ¿Olvidaste tu Contraseña?{' '}
                    <Anchor component={Link} href="/forgot-password" fw={700}>
                        Recuperar Contraseña
                    </Anchor>
                </Text>
            </form>
        </Paper>
    );
}
