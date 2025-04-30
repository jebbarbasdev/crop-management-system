import { Metadata } from 'next';
import ResetForm from './_components/ResetForm';

export const metadata: Metadata = {
    title: "Restablecer Contraseña | Crop Management System",
    description: "Restablece tu contraseña en Crop Management System",
};

export default function ResetPasswordPage() {
    return (
        <ResetForm></ResetForm>
    );
}
