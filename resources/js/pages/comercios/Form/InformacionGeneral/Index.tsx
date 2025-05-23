import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUploader from '@/components/ui/ImageUploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multiselect';
import { Select, SelectItem } from '@/components/ui/select';
import StarRating from '@/components/ui/StarRating';
import { showAlert } from '@/plugins/sweetalert';
import { useForm } from '@inertiajs/react';
import { SelectContent, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { E164Number } from 'node_modules/libphonenumber-js/types';
import { FormEventHandler, useEffect, useState } from 'react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import DraggableMarkerMap from './DraggableMarkerMap';

type ThisForm = {
    nombre: string;
    usuarios_id: string;
    localidades_id: string;
    tipos_dieta: string[];
    categorias: string[];
    direccion: string;
    latitud: number;
    longitud: number;
    verificado: boolean | 'indeterminate';
    tipo_suscripcion: string;
    logo: string | null;
    banner: string | null;
    estrellas: number;
    rating_precios: number;
    numero: string | undefined;
    phone: E164Number | undefined;
    country: string | undefined;
    area: string | undefined;
};

export const Index = ({ id }: any) => {
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<ThisForm>>({
        nombre: '',
        usuarios_id: '',
        localidades_id: '',
        tipos_dieta: [],
        categorias: [],
        direccion: '',
        latitud: 19.4326,
        longitud: -99.1332,
        verificado: false,
        tipo_suscripcion: '',
        logo: null,
        banner: null,
        estrellas: 0,
        rating_precios: 0,
        numero: '',
        phone: undefined,
        country: '',
        area: '',
    });

    const [usuarios, setUsuarios] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [tiposDieta, setTiposDieta] = useState([]);
    const [resetKey, setResetKey] = useState(Date.now());

    const handlePhoneChange = (value: E164Number | undefined) => {
        setData('phone', value);

        if (value) {
            try {
                const countryRules = {
                    CO: { areaCodeLength: 3 }, // Colombia: primeros 3 dígitos = área (móvil)
                    AR: { areaCodeLength: 2 }, // Argentina: primeros 2 dígitos = área
                    US: { areaCodeLength: 3 }, // EE.UU.: primeros 3 dígitos = área
                    default: { areaCodeLength: 0 },
                };

                const parsedNumber = parsePhoneNumber(value);
                const areaCode = parsedNumber?.nationalNumber.slice(0, countryRules[parsedNumber?.country ?? 'AR']?.areaCodeLength || 0);

                setData('country', parsedNumber?.countryCallingCode);
                setData('area', areaCode);
                setData('numero', parsedNumber?.nationalNumber.slice(areaCode?.length ?? 3));
            } catch (error) {
                console.error('Error al parsear el número:', error);
            }
        }
    };

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
                        data: { data: usuarios },
                    },{
                        data: { data: localidades },
                    },
                    {
                        data: { data: categorias },
                    },
                    {
                        data: { data: tipos_dieta },
                    },
                ]: any = await Promise.all([
                    axios.get(route('usuarios.index')),
                    axios.get(route('localidades.index')),
                    axios.get(route('categorias.index')),
                    axios.get(route('tipos_dieta.index')),
                ]);

                setUsuarios(usuarios ?? []);
                setLocalidades(localidades ?? []);
                setCategorias(
                    categorias.map((cat: any) => {
                        return { label: cat.nombre, value: cat.id };
                    }) ?? [],
                );
                setTiposDieta(
                    tipos_dieta.map((cat: any) => {
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
                tipos_dieta:
                    item.tipos_dieta.map((tipo: any) => {
                        return tipo.id;
                    }) || [],
                usuarios_id: item.usuario?.id.toString() || '',
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
                country: item.telefono.codigo_pais,
                area: item.telefono.codigo_area,
                numero: item.telefono.numero,
                phone: `+${item.telefono.codigo_pais}${item.telefono.codigo_area}${item.telefono.numero}`,
            });

            setResetKey(Date.now());
        };

        if (id) onGetItem();
    }, [id]);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="mt-8 grid grid-cols-2 gap-4">
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

                        <div>
                            <Label htmlFor="usuarios_id"> Usuario </Label>
                            <Select
                                key={`usuarios_id-${resetKey}`}
                                defaultValue={data.usuarios_id}
                                onValueChange={(value) => setData('usuarios_id', value)}
                            >
                                <SelectTrigger className="flex w-full justify-start rounded-md border border-gray-300 px-3 py-2 text-sm">
                                    <SelectValue placeholder="Selecciona un Usuario" />
                                </SelectTrigger>
                                <SelectContent
                                    position="popper"
                                    align="start"
                                    side="bottom"
                                    sideOffset={3}
                                    className="rounded-md border border-gray-300 bg-white p-1 shadow-md"
                                >
                                    {usuarios.map((item: any, idx: number) => {
                                        return (
                                            <SelectItem key={idx} value={`${item.id}`}>
                                                {' '}
                                                {item.name}{' '}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {errors.usuarios_id && <p className="mt-1 text-sm text-red-500">{errors.usuarios_id}</p>}
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

                        <div>
                            <Label htmlFor="tipos_dieta"> Tiños de Dieta </Label>
                            <MultiSelect
                                placeholder="Selecciona Tipos de Dieta"
                                selected={data.tipos_dieta}
                                onChange={(newSelected) => setData('tipos_dieta', newSelected)}
                                options={tiposDieta}
                            />

                            {errors.categorias && <p className="mt-1 text-sm text-red-500">{errors.categorias}</p>}
                        </div>

                        <div>
                            <Label htmlFor="phone"> Teléfono </Label>
                            <div className="relative">
                                <PhoneInput
                                    className={`relative flex w-full items-center rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                    defaultCountry="AR"
                                    placeholder="Ingrese su teléfono"
                                    value={data.phone?.replaceAll(' ', '')}
                                    onChange={handlePhoneChange}
                                    international={false}
                                    countryCallingCodeEditable={false}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-start space-y-3">
                            <Label htmlFor="verificado"> Estrellas </Label>

                            <div className="flex">
                                <StarRating
                                    readOnly={true}
                                    key={`stars-${resetKey}`}
                                    resetKey={resetKey}
                                    initialRating={data.estrellas}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-start space-y-3">
                            <Label htmlFor="verificado"> Rating de Precios </Label>

                            <div className="flex">
                                <StarRating
                                    readOnly={true}
                                    key={`stars-${resetKey}`}
                                    resetKey={resetKey}
                                    initialRating={data.rating_precios}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="logo"> Logo </Label>
                            <ImageUploader
                                initialFiles={data.logo ? [data.logo] : []}
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
                                initialFiles={data.banner ? [data.banner] : []}
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
