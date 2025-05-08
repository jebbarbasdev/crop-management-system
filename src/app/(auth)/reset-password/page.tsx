import { Metadata } from 'next';
import ResetForm from './_components/ResetForm';

export const metadata: Metadata = {
    title: "Nueva Contraseña | Crop Management System",
    description: "Establece tu nueva contraseña para acceder a tu cuenta en Crop Management System",
};

export default function ResetPasswordPage() {
    return (
        <ResetForm></ResetForm>
    );
}
