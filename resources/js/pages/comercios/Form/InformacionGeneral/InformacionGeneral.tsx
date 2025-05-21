import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multiselect';
import { Select, SelectItem } from '@/components/ui/select';
import { showAlert } from '@/plugins/sweetalert';
import { useForm } from '@inertiajs/react';
import { SelectContent, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import DraggableMarkerMap from './DraggableMarkerMap';
import ImageUploader from './ImageUploader';
import StarRating from './StarRating';

type ThisForm = {
    nombre: string;
    localidades_id: string;
    categorias: string[];
    direccion: string;
    latitud: number;
    longitud: number;
    verificado: boolean | 'indeterminate';
    tipo_suscripcion: string;
    logo: string;
    banner: string;
    estrellas: number;
    rating_precios: number;
};

export const InformacionGeneral = ({ id }: any) => {
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<ThisForm>>({
        nombre: '',
        localidades_id: '',
        categorias: [],
        direccion: '',
        latitud: 19.4326,
        longitud: -99.1332,
        verificado: false,
        tipo_suscripcion: '',
        logo: '',
        banner: '',
        estrellas: 0,
        rating_precios: 0,
    });

    const [localidades, setLocalidades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [resetKey, setResetKey] = useState(Date.now());

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        console.log(data);

        const options = {
            onSuccess: () => {
                if (!id) {
                    reset();
                    setResetKey(Date.now());
                }
                showAlert('success', 'Registro guardado');
            },
            onError: (errors: any) => {
                console.log(errors);
                reset();
                setResetKey(Date.now());
            },
        };

        if (id) {
            put(route('comercios.update', id), options);
        } else {
            post(route('comercios.store'), options);
        }
    };

    const onAddressUpdate = (evt: any) => {
        setData('direccion', evt.address);
        setData('latitud', evt.latitude);
        setData('longitud', evt.longitude);
    };

    const onDataChange = (evt: any, key: keyof ThisForm) => {
        setData(key, evt);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const [
                    {
                        data: { data: localidades },
                    },
                    {
                        data: { data: categorias },
                    },
                ]: any = await Promise.all([axios.get(route('localidades.index')), axios.get(route('categorias.index'))]);

                setLocalidades(localidades ?? []);
                setCategorias(
                    categorias.map((cat: any) => {
                        return { label: cat.nombre, value: cat.id };
                    }) ?? [],
                );
            } catch (error) {
                console.error('Error fetching data:', error);
                showAlert('error', 'No se pudieron cargar algunos datos');
            }
        };

        getData();
    }, []);

    useEffect(() => {
        
        const onGetItem = async () => {
            reset();
            
            const { data: response } = await axios.get(route('comercios.show', id));
            const item = response.data;

            setData({
                nombre: item.nombre || '',
                categorias:
                    item.categorias.map((cat: any) => {
                        return cat.id;
                    }) || [],
                localidades_id: item.localidad?.id.toString() || '',
                direccion: item.direccion || '',
                latitud: Number(item.latitud) || 0,
                longitud: Number(item.longitud) || 0,
                verificado: item.verificado == 1 ? true : false,
                tipo_suscripcion: item.tipo_suscripcion || '',
                logo: item.logo || '',
                banner: item.banner || '',
                estrellas: item.estrellas || 0,
                rating_precios: item.rating_precios || 0,
            });

            setResetKey(Date.now());
        };

        if (id) onGetItem();
    }, [id]);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                defaultChecked={data.verificado}
                                key={`checkbox-${resetKey}`}
                                id="verificado"
                                onCheckedChange={(checked) => setData('verificado', checked)}
                            />
                            <Label htmlFor="verificado"> Cuenta Verificada </Label>

                            {errors.verificado && <p className="mt-1 text-sm text-red-500">{errors.verificado}</p>}
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4">
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
                            <Label htmlFor="categorias"> Categorías </Label>
                            <MultiSelect
                                placeholder="Selecciona Categorías"
                                selected={data.categorias}
                                onChange={(newSelected) => setData('categorias', newSelected)}
                                options={categorias}
                            />

                            {errors.categorias && <p className="mt-1 text-sm text-red-500">{errors.categorias}</p>}
                        </div>

                        <div>
                            <Label htmlFor="localidades_id"> Localidad </Label>
                            <Select
                                key={`localidades_id-${resetKey}`}
                                defaultValue={data.localidades_id}
                                onValueChange={(value) => setData('localidades_id', value)}
                            >
                                <SelectTrigger className="flex w-full justify-start rounded-md border border-gray-300 px-3 py-2 text-sm">
                                    <SelectValue placeholder="Selecciona una Localidad" />
                                </SelectTrigger>
                                <SelectContent
                                    position="popper"
                                    align="start"
                                    side="bottom"
                                    sideOffset={3}
                                    className="rounded-md border border-gray-300 bg-white p-1 shadow-md"
                                >
                                    {localidades.map((item: any, idx: number) => {
                                        return (
                                            <SelectItem key={idx} value={`${item.id}`}>
                                                {' '}
                                                {item.nombre}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {errors.localidades_id && <p className="mt-1 text-sm text-red-500">{errors.localidades_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="tipo_suscripcion"> Tipo de Suscripción </Label>
                            <Select
                                key={`tipo_suscripcion-${resetKey}`}
                                defaultValue={data.tipo_suscripcion}
                                onValueChange={(value) => setData('tipo_suscripcion', value)}
                            >
                                <SelectTrigger className="flex w-full justify-start rounded-md border border-gray-300 px-3 py-2 text-sm">
                                    <SelectValue placeholder="Selecciona un Tipo de Suscripción" />
                                </SelectTrigger>
                                <SelectContent
                                    position="popper"
                                    align="start"
                                    side="bottom"
                                    sideOffset={3}
                                    className="rounded-md border border-gray-300 bg-white p-1 shadow-md"
                                >
                                    <SelectItem value="A"> A </SelectItem>
                                    <SelectItem value="B"> B </SelectItem>
                                </SelectContent>
                            </Select>

                            {errors.tipo_suscripcion && <p className="mt-1 text-sm text-red-500">{errors.tipo_suscripcion}</p>}
                        </div>

                        <div className="flex flex-col items-start justify-start space-y-3">
                            <Label htmlFor="verificado"> Estrellas </Label>

                            <div className="flex">
                                <StarRating
                                    key={`stars-${resetKey}`}
                                    resetKey={resetKey}
                                    initialRating={data.estrellas}
                                    onRatingChange={(e: any) => onDataChange(e, 'estrellas')}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-start space-y-3">
                            <Label htmlFor="verificado"> Rating de Precios </Label>

                            <div className="flex">
                                <StarRating
                                    key={`stars-${resetKey}`}
                                    resetKey={resetKey}
                                    initialRating={data.rating_precios}
                                    onRatingChange={(e: any) => onDataChange(e, 'rating_precios')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="logo"> Logo </Label>
                            <ImageUploader
                                initialFiles={[data.logo]}
                                key={`image-${resetKey}`}
                                resetKey={resetKey}
                                maxFiles={1}
                                multiple={false}
                                onFilesChange={(e: any) => onDataChange(e[0], 'logo')}
                            />
                        </div>

                        <div>
                            <Label htmlFor="banner"> Banner </Label>
                            <ImageUploader
                                initialFiles={[data.banner]}
                                key={`image-${resetKey}`}
                                resetKey={resetKey}
                                maxFiles={1}
                                multiple={false}
                                onFilesChange={(e: any) => onDataChange(e[0], 'banner')}
                            />
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4">
                        <div>
                            <DraggableMarkerMap
                                initialAddress={data.direccion}
                                initialPosition={{ lat: data.latitud, lng: data.longitud }}
                                onAddressUpdate={onAddressUpdate}
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
                                setResetKey(Date.now());
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
