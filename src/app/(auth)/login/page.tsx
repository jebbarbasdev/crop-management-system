import { Metadata } from 'next';
import LoginForm from './_components/login-form';

export const metadata: Metadata = {
    title: "Iniciar Sesión | Crop Management System",
    description: "Inicia Sesión en Crop Management System",
};

export default function LoginPage() {
    return (
        <LoginForm></LoginForm>
    );
}
