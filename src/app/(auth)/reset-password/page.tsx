import { Metadata } from 'next';
import ResetForm from './_components/ResetForm';

export const metadata: Metadata = {
    title: "Iniciar Sesión | Crop Management System",
    description: "Inicia Sesión en Crop Management System",
};

export default function SignInPage() {
    return (
        <ResetForm></ResetForm>
    );
}
