import { Button } from '@/components/ui/button';
import { Modal } from '@/Components/ui/Modal';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import AppLayout from '@/layouts/app-layout';
import { confirmDialog, showAlert } from '@/plugins/sweetalert';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Form } from './Form';

export default function ({ id, lista }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Comercios',
            href: '/comercios',
        },
        {
            title: 'Gestionar Comercios',
            href: '/comercios/editar/' + id,
        },
        {
            title: 'Productos',
            href: '',
        },
    ];

    const currentUrl = usePage().url;
    const { flash }: any = usePage().props;
    const [productId, setProductId] = useState<number | null>(null);
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);

    const onBack = () => {
        window.history.back();
    };

    const onEdit = (id: number) => {
        setProductId(id);
        setShow(true);
    };
    const onTrash = async (_id: number) => {
        const result = await confirmDialog({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
        });

        if (result.isConfirmed) {
            router.delete(route('productos.destroy', _id), {
                preserveScroll: true,
                onSuccess: async () => {
                    await showAlert('success', 'Registro eliminado');

                    const currentPage = lista.current_page;
                    const remainingItems = lista.data.length - 1;

                    if (remainingItems === 0 && currentPage > 1) {
                        router.visit(`/productos/${id}?page=${currentPage - 1}`);
                    } else {
                        router.visit(`productos/${id}?page=${currentPage}`);
                    }
                },
                onError: () => showAlert('error', 'Error al eliminar'),
            });
        }
    };

    const onReload = () => {
        router.visit(currentUrl, {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (flash?.success) {
            showAlert('success', flash.success);
        }
        if (flash?.error) {
            showAlert('error', flash.error);
        }
        if (flash?.warning) {
            showAlert('warning', flash.warning);
        }
    }, [flash]);

    useEffect(() => {
        const onSetData = () => {
            const data = lista.data.map((item: any) => {
                return {
                    id: item.id,
                    categoria: item.categoria?.nombre || '',
                    nombre: item.nombre || '',
                    descripcion: item.descripcion?.length > 50 ? item.descripcion.substring(0, 47) + '...' : item.descripcion,
                    precio: item.precio || 0,
                    rating: item.rating || 0,
                };
            });
            setData(data);
        };

        onSetData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos" />

            <div className="flex w-full items-center justify-end gap-4 px-4 pt-4">
                <Button variant={'outline'} onClick={onBack}>
                    {' '}
                    Regresar{' '}
                </Button>
                <Button onClick={() => setShow(true)}> Agregar </Button>
            </div>

            <div className="overflow-x-auto px-4">
                <Table
                    data={data}
                    titles={['Categoría', 'Producto', 'Descripción', 'Precio', 'Rating']}
                    actions={[
                        { icon: Edit3, action: onEdit, title: 'Editar' },
                        { icon: Trash2, action: onTrash, title: 'Eliminar' },
                    ]}
                    onRow={() => {}}
                />

                <Pagination links={lista.links} />

                <Modal show={show} closeable={true} title="Gestionar Productos">
                    <Form
                        id={id}
                        productId={productId}
                        onReload={onReload}
                        onClose={() => {
                            setShow(false);
                            setProductId(null);
                        }}
                    />
                </Modal>
            </div>
        </AppLayout>
    );
}
