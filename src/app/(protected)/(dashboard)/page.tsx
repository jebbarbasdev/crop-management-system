import { Metadata } from 'next';
import GenericTitle from '../../_components/GenericTitle';
import { getUserWithCustomClaims } from '../../_services/getUserWithCustomClaims';
import DashboardCard from './_components/DashboardCard';

export const metadata: Metadata = {
    title: "Dashboard | Crop Management System",
    description: "Página de Dashboard de Crop Management System",
};

export default async function DashboardPage() {
    const user = await getUserWithCustomClaims()

    return (
        <div>
            <GenericTitle>Bievenido a Crop Management System</GenericTitle>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {user && Object.values(user.modulesWithAccess).map(module => (            
                    <DashboardCard key={module.id} slug={module.slug} module={module.name} />                
                ))}
            </div>
        </div>
    );
}
