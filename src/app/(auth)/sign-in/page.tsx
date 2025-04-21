import { Metadata } from 'next';
import LoginForm from './_components/signInForm';

export const metadata: Metadata = {
    title: "Iniciar Sesión | Crop Management System",
    description: "Inicia Sesión en Crop Management System",
};

export default function SignInPage() {
    return (
        <LoginForm></LoginForm>
    );
}
