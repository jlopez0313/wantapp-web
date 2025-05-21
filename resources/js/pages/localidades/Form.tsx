import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect } from "react";

type ThisForm = {
    nombre: string;
};

export const Form = ({ id, onReload, onClose }: any) => {

    const { data, setData, post, put, processing, errors, reset } = useForm<Required<ThisForm>>({
        nombre: '',
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                reset(); 
                onClose();
                onReload();
            },
            onError: (errors: any) => {
                console.log( errors )
                if (errors.nombre) {
                    reset('nombre');
                }
            },
        };

        if (id) {
            put(route('localidades.update',id), options);
        } else {
            post(route('localidades.store'), options);
        }
    };

    const onGetItem = async () => {

        const { data: response } = await axios.get(route('localidades.show', id));
        const item = response.data;

        setData({
            nombre: item.nombre || '',
        });
    }

    useEffect(() => {
        reset();
        if (id) onGetItem();
    }, [id])

    return (
        <div className="pb-12 pt-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-4">
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
                            
                            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Button
                            variant={"outline"}
                            className="ms-4 mx-4"
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
