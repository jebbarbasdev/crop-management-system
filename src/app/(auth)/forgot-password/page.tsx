import { Metadata } from 'next';
import ForgotForm from './_components/forgot-form';

export const metadata: Metadata = {
    title: "Recuperar Contraseña | Crop Management System",
    description: "Recupera tu Contraseña de Crop Management System",
};

export default function LoginPage() {
    return (
        <ForgotForm></ForgotForm>
    );
}
