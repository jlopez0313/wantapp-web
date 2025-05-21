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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Localidades',
        href: '/localidades',
    },
];

export default function Index({ auth, lista }: any) {

    const currentUrl = usePage().url;
    const { flash }: any = usePage().props;
    const [id, setId] = useState<number | null>(null);
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);


    const onEdit = (id: number) => {
        setId(id)
        setShow(true)
    }

    const onTrash = async (id: number) => {
        const result = await confirmDialog({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning'
        });

        if (result.isConfirmed) {
            router.delete(route('localidades.destroy', id), {
                preserveScroll: true,
                onSuccess: async () => {
                    await showAlert('success', 'Registro eliminado');
                    
                    const currentPage = lista.current_page;
                    const remainingItems = lista.data.length - 1;

                    
                    if (remainingItems === 0 && currentPage > 1) {
                        router.visit(`/localidades?page=${currentPage - 1}`);
                    } else {
                        router.visit(`localidades?page=${currentPage}`);
                    }
                },
                onError: () => showAlert('error', 'Error al eliminar')
            });
        }
    }

    const onReload = () => {
        router.visit(currentUrl, {
            preserveScroll: true,
        });
    }

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
                    nombre: item.nombre
                }
            })
            setData(data)
        }

        onSetData();
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Localidades" />

            <div className='flex items-center w-full justify-end px-4 pt-4'>
                <Button onClick={() => setShow(true)}> Agregar </Button>
            </div>

            <div className="overflow-x-auto px-4">
                <Table
                    user={auth.user}
                    data={data}
                    titles={['Localidad']}
                    actions={[
                        { icon: Edit3, action: onEdit, title: 'Editar' },
                        { icon: Trash2, action: onTrash, title: 'Eliminar' },
                    ]}
                    onRow={() => { }}
                />

                <Pagination links={lista.links} />

                <Modal show={show} closeable={true} title="Gestionar Localidades">
                    <Form id={id} onReload={onReload} onClose={() => { setShow(false); setId(null); }} />
                </Modal>
                
            </div>
        </AppLayout>
    );
}
