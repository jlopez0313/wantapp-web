import { Button } from '@/components/ui/button';
import { Modal } from '@/Components/ui/Modal';
import { Table } from '@/components/ui/Table/Table';
import { confirmDialog, showAlert } from '@/plugins/sweetalert';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Form } from './Form';

export const Redes = ({ id }: { id?: number }) => {
    
    const [redId, setRedId] = useState<number | null>(null);
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);

    const onLoad = async () => {
        const { data: response } = await axios.get(route('redes.index', {id}));
        
        const data = response.data.map((item: any) => {
            return {
                id: item.id,
                nombre: item.nombre,
                url: item.url,
            }
        })
        setData(data);
    };

    const onEdit = (id: number) => {
        setRedId(id);
        setShow(true);
    };

    const onTrash = async (id: number) => {
        const result = await confirmDialog({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
        });

        if (result.isConfirmed) {
            router.delete(route('redes.destroy', id), {
                preserveScroll: true,
                onSuccess: async () => {
                    await showAlert('success', 'Registro eliminado');
                    onLoad();
                },
                onError: () => showAlert('error', 'Error al eliminar'),
            });
        }
    };

    useEffect(() => {
        onLoad()
    }, [id]);

    return (
        <div className="pt-6 pb-12">
            <div className="flex w-full items-center justify-end px-4 pt-4">
                <Button type="button" onClick={() => setShow(true)}>
                    Agregar Red
                </Button>
            </div>

            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Table
                    data={data}
                    titles={['Nombre', 'Url']}
                    actions={[
                        { icon: Edit3, action: onEdit, title: 'Editar' },
                        { icon: Trash2, action: onTrash, title: 'Eliminar' },
                    ]}
                    onRow={() => {}}
                />

                <Modal show={show} closeable={true} title="Gestionar Redes Sociales">
                    <Form
                        id={id}
                        redId={redId}
                        onLoad={onLoad}
                        onClose={() => {
                            setShow(false);
                            setRedId(null);
                        }}
                    />
                </Modal>
            </div>
        </div>
    );
};
