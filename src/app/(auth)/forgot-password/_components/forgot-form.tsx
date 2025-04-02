import { Button, Paper, TextInput, Title, Text, Anchor } from '@mantine/core';
import Link from 'next/link';

import css from './forgot-form.module.css'

export default function ForgotForm() {
    return (
        <Paper className={css.form} radius={0} p={30}>
            <div>
                <Title className={css.title} order={2} ta="center" my="md">
                    ¿Olvidaste tu Contraseña?
                </Title>

                <Text ta="center" my="md">
                    Ingresa tu correo electrónico para obtener un link de recuperación
                </Text>

                <TextInput label="Correo Electrónico" placeholder="hello@gmail.com" size="md" />
                                
                <Button fullWidth mt="xl" size="md">
                    Recuperar Contraseña
                </Button>

                <Text ta="center" mt="md">
                    ¿Ya Tienes tu Contraseña?{' '}
                    <Anchor component={Link} href="/login" fw={700}>
                        Iniciar Sesión
                    </Anchor>
                </Text>
            </div>
        </Paper>
    );
}
