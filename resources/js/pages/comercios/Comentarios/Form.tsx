import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";

type ThisForm = {
    comentario: string;
    respuesta: string;
    aprobado: boolean | 'indeterminate';
};

export const Form = ({ id, onReload, onClose }: any) => {

    const { data, setData, post, put, processing, errors, reset } = useForm<Required<ThisForm>>({
        comentario: '',
        respuesta: '',
        aprobado: false,
    });

    const [resetKey, setResetKey] = useState(Date.now());

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
                    reset('respuesta');
                }
            },
        };

        put(route('comentarios.update',id), options);
    };

    const onGetItem = async () => {

        const { data: response } = await axios.get(route('comentarios.show', id));
        const item = response.data;
        
        setData({
            comentario: item?.comentario || '',
            respuesta: item?.respuesta?.respuesta || '',
            aprobado: item?.aprobado == 1 ? true : false,
        });

        setResetKey( Date.now());
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
                            <Label htmlFor="comentario"> Comentario </Label>

                            <Textarea
                                rows={4}
                                readOnly={true}
                                id="comentario"
                                name="comentario"
                                required
                                value={data.comentario}
                                placeholder="Comentario"
                            />
                            
                            {errors.respuesta && <p className="text-red-500 text-sm mt-1">{errors.respuesta}</p>}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                defaultChecked={data.aprobado}
                                key={`checkbox-${resetKey}`}
                                id="verificado"
                                onCheckedChange={(checked) => setData('aprobado', checked)}
                            />
                            <Label htmlFor="verificado"> Comentario Aprobado </Label>

                            {errors.aprobado && <p className="mt-1 text-sm text-red-500">{errors.aprobado}</p>}
                        </div>
                        <div>
                            <Label htmlFor="respuesta"> Respuesta </Label>

                            <Textarea
                                rows={4}
                                id="respuesta"
                                name="respuesta"
                                required
                                value={data.respuesta}
                                placeholder="Respuesta"
                                onChange={(e) => setData('respuesta', e.target.value)}
                            />
                            
                            {errors.respuesta && <p className="text-red-500 text-sm mt-1">{errors.respuesta}</p>}
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
