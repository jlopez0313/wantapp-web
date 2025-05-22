import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Horarios } from './Horarios/Horarios';
import { Index } from './InformacionGeneral/Index';
import { Redes } from './Redes/Redes';


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

    const goToComments = () => {
        router.visit('/comentarios/' + id)
    }

    const goToProductos = () => {
        router.visit('/productos/' + id)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestionar Comercios" />

            <Tabs defaultValue="info" className="w-full p-2">
                <TabsList className="w-full flex space-x-2 bg-gray-100 rounded-md p-1">
                    <TabsTrigger value="info" className="flex-1">Información General</TabsTrigger>
                    <TabsTrigger value="horarios" className="flex-1">Horarios</TabsTrigger>
                    <TabsTrigger value="redes" className="flex-1">Redes Sociales</TabsTrigger>
                    <TabsTrigger value="productos" className="flex-1" onClick={goToProductos}>Productos</TabsTrigger>
                    <TabsTrigger value="comentarios" className="flex-1" onClick={goToComments}>Comentarios</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-4">
                    <Index id={id}/>
                </TabsContent>
                <TabsContent value="horarios" className="mt-4">
                    <Horarios id={id} />
                </TabsContent>
                <TabsContent value="redes" className="mt-4">
                    <Redes id={id} />
                </TabsContent>
            </Tabs>
        </AppLayout>
    )
}
