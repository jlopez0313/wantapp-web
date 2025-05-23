import RoleCheck from '@/auth/RoleBasedAccess';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/ui/StarRating';
import { Pagination } from '@/components/ui/Table/Pagination';
import { Table } from '@/components/ui/Table/Table';
import AppLayout from '@/layouts/app-layout';
import { confirmDialog, showAlert } from '@/plugins/sweetalert';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Apple, Edit3, MessagesSquare, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comercios',
        href: '/comercios',
    },
];

export default function Index({ auth, userId, lista }: any) {

    const currentUrl = usePage().url;
    const { flash }: any = usePage().props;
    const [id, setId] = useState<number | null>(null);
    const [data, setData] = useState([]);

    const onGoToForm = (id?: number) => {
        if ( id ) {
            router.visit(route('comercios.edit', id))
        } else {
            router.visit(route('comercios.create'))
        }
    }

    const onGoBack = () => {
        window.history.back();
    }

    const onEdit = (id: number) => {
        onGoToForm(id)
    }

    const onProducts = (id: number) => {
        router.visit('/productos/' + id)
    }

    const onComment = (id: number) => {
        router.visit('/comentarios/comercios/' + id)
    }

    const onTrash = async (id: number) => {

        const result = await confirmDialog({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning'
        });

        if (result.isConfirmed) {
            router.delete(route('comercios.destroy', id), {
                preserveScroll: true,
                onSuccess: async () => {
                    await showAlert('success', 'Registro eliminado');
                    const currentPage = lista.current_page;
                    const remainingItems = lista.data.length - 1;


                    if (remainingItems === 0 && currentPage > 1) {
                        router.visit(`/comercios?page=${currentPage - 1}`);
                    } else {
                        router.visit(`comercios?page=${currentPage}`);
                    }
                },
                onError: () => showAlert('error', 'Error al eliminar')
            });
        }
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
                    nombre: item.nombre,
                    usuario: item.usuario?.name || '',
                    pts: <StarRating readOnly={true} initialRating={item.estrellas} />,
                    rating: <StarRating readOnly={true} initialRating={item.rating} />,
                }
            })
            setData(data)
        }

        onSetData();
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Comercios" />
            {
                userId ?
                    <div className='flex items-center w-full justify-end px-4 pt-4'>
                        <Button onClick={() => onGoBack()} variant={'outline'}> Regresar </Button>
                    </div>
                :
                <RoleCheck role='admin'>
                    <div className='flex items-center w-full justify-end px-4 pt-4'>
                        <Button onClick={() => onGoToForm()}> Agregar </Button>
                    </div>
                </RoleCheck>
            }

            <div className="overflow-x-auto px-4">
                <Table
                    user={auth.user}
                    data={data}
                    titles={['Comercio', 'Usuario', 'Estrellas', 'Rating Precios']}
                    actions={[
                        !userId && { icon: Apple, action: onProducts, title: 'Productos' },
                        !userId && { icon: MessagesSquare, action: onComment, title: 'Comentarios' },
                        (!userId && auth.user.role == 'admin') && { icon: Edit3, action: onEdit, title: 'Editar' },
                        (!userId && auth.user.role == 'admin') && { icon: Trash2, action: onTrash, title: 'Eliminar' },
                    ]}
                    onRow={() => { }}
                />

                <Pagination links={lista.links} />
            </div>
        </AppLayout>
    );
}
