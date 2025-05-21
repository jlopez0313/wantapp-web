import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Horarios } from './Horarios/Horarios';
import { InformacionGeneral } from './InformacionGeneral/InformacionGeneral';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comercios',
        href: '/comercios',
    },
    {
        title: 'Gestionar Comercios',
        href: '',
    },
];

export default function ({ id }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestionar Comercios" />

            <Tabs defaultValue="account" className="w-full p-2">
                <TabsList className="w-full flex space-x-2 bg-gray-100 rounded-md p-1">
                    <TabsTrigger value="account" className="flex-1">Información General</TabsTrigger>
                    <TabsTrigger value="password" className="flex-1">Horarios</TabsTrigger>
                    <TabsTrigger value="info" className="flex-1">Contraseña</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="mt-4">
                    <InformacionGeneral id={id}/>
                </TabsContent>
                <TabsContent value="password" className="mt-4">
                    <Horarios id={id} />
                </TabsContent>
                <TabsContent value="info" className="mt-4">
                    <p>Contenido de la pestaña Información</p>
                </TabsContent>
            </Tabs>
        </AppLayout>
    )
}
