import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/ui/ImageUploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from '@/components/ui/StarRating';
import { Textarea } from '@/components/ui/textarea';
import { showAlert } from '@/plugins/sweetalert';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type ThisForm = {
    comercios_id: string;
    categorias_id: string;
    nombre: string;
    descripcion: string;
    precio: string;
    rating: string;
    imagen: string | null;
};

export const Form = ({ id, productId, onReload, onClose }: any) => {
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<ThisForm>>({
        comercios_id: id,
        categorias_id: '',
        nombre: '',
        descripcion: '',
        precio: '',
        rating: '',
        imagen: '',
    });

    const [resetKey, setResetKey] = useState(Date.now());
    const [categorias, setCategorias] = useState([]);

    const onDataChange = (evt: any, key: keyof ThisForm) => {
        setData(key, evt);
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                reset();
                onClose();
                onReload();
            },
            onError: (errors: any) => {
                console.log(errors);
                if (errors.nombre) {
                    reset('nombre');
                }
            },
        };

        if ( productId ) {
            put(route('productos.update', productId), options);
        } else {
            post(route('productos.store'), options);
        }
    };

    const onGetItem = async () => {
        const { data: response } = await axios.get(route('productos.show', productId));
        const item = response.data;

        setData({
            comercios_id: item.comercios_id || '',
            categorias_id: item.categorias_id.toString() || '',
            nombre: item.nombre || '',
            descripcion: item.descripcion || '',
            precio: item.precio || '',
            rating: item.rating || '',
            imagen: item.imagen || '',
        });

        setResetKey(Date.now());
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const {
                    data: { data: categorias },
                } = await axios.get(route('categorias.index'));
                setCategorias(categorias);
            } catch (error) {
                console.error('Error fetching data:', error);
                showAlert('error', 'No se pudieron cargar algunos datos');
            }
        };

        getData();
    }, []);

    useEffect(() => {
        reset();
        if (productId) onGetItem();
    }, [productId]);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="categorias_id"> Categoría </Label>
                            <Select
                                key={`categorias_id-${resetKey}`}
                                defaultValue={data.categorias_id}
                                onValueChange={(value) => value ? setData('categorias_id', value) : null }
                            >
                                <SelectTrigger className="flex w-full justify-start rounded-md border border-gray-300 px-3 py-2 text-sm">
                                    <SelectValue placeholder="Selecciona una Categoría" />
                                </SelectTrigger>
                                <SelectContent
                                    position="popper"
                                    align="start"
                                    side="bottom"
                                    sideOffset={3}
                                    className="rounded-md border border-gray-300 bg-white p-1 shadow-md"
                                >
                                    {categorias.map((item: any, idx: number) => {
                                        return (
                                            <SelectItem key={idx} value={`${item.id}`}>
                                                {' '}
                                                {item.nombre}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {errors.categorias_id && <p className="mt-1 text-sm text-red-500">{errors.categorias_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="nombre"> Nombre </Label>
                            <Input
                                autoFocus
                                id="nombre"
                                name="nombre"
                                required
                                value={data.nombre}
                                placeholder="Nombre"
                                onChange={(e) => setData('nombre', e.target.value)}
                            />

                            {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                        </div>

                        <div>
                            <Label htmlFor="precio"> Precio </Label>
                            <Input
                                type="number"
                                autoFocus
                                id="precio"
                                name="precio"
                                required
                                value={data.precio}
                                placeholder="Nombre"
                                onChange={(e) => setData('precio', e.target.value)}
                            />

                            {errors.precio && <p className="mt-1 text-sm text-red-500">{errors.precio}</p>}
                        </div>

                        <div className="flex flex-col items-start justify-start space-y-3">
                            <Label htmlFor="verificado"> Estrellas </Label>

                            <div className="flex">
                                <StarRating
                                    readOnly={true}
                                    key={`stars-${resetKey}`}
                                    resetKey={resetKey}
                                    initialRating={data.rating}
                                    onRatingChange={(e: any) => onDataChange(e, 'rating')}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="descripcion"> Descripción </Label>

                            <Textarea
                                rows={4}
                                id="descripcion"
                                name="descripcion"
                                required
                                value={data.descripcion}
                                placeholder="descripcion"
                                onChange={(e) => setData('descripcion', e.target.value)}
                            />

                            {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
                        </div>

                        <div>
                            <Label htmlFor="imagen"> Imagen </Label>
                            <ImageUploader
                                initialFiles={data.imagen ? [data.imagen] : []}
                                key={`image-${resetKey}`}
                                resetKey={resetKey}
                                maxFiles={1}
                                multiple={false}
                                onFilesChange={(e: any) => onDataChange(e[0], 'imagen')}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        <Button
                            variant={'outline'}
                            className="mx-4 ms-4"
                            disabled={processing}
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button disabled={processing}>
                            Guardar
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
