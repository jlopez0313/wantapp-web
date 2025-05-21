import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { showAlert } from '@/plugins/sweetalert';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Copy, LoaderCircle, MinusSquare } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type FranjaHoraria = {
    hora_inicio: string;
    hora_fin: string;
};

type ThisForm = {
    dias: {
        dia: string;
        abierto: boolean;
        franjas: FranjaHoraria[];
    }[];
    comercio: number | undefined;
};

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const Horarios = ({ id }: { id?: number }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm<ThisForm>({
        dias: DIAS_SEMANA.map((dia) => ({
            dia,
            abierto: false,
            franjas: [{ hora_inicio: '09:00', hora_fin: '18:00' }],
        })),
        comercio: id,
    });

    const [resetKey, setResetKey] = useState(Date.now());

    const onFranjaChange = (diaIdx: number, franjaIdx: number, field: keyof FranjaHoraria, value: string) => {
        setData((prev) => {
            const nuevosDias = [...prev.dias];
            nuevosDias[diaIdx].franjas[franjaIdx][field] = value;
            return { ...prev, dias: nuevosDias };
        });
    };

    const onCloneFranja = (diaIdx: number, franjaIdx: number) => {
        setData((prev) => {
            const nuevosDias = [...prev.dias];
            const franjaAClonar = { ...nuevosDias[diaIdx].franjas[franjaIdx] };
            nuevosDias[diaIdx].franjas.splice(franjaIdx + 1, 0, franjaAClonar);
            return { ...prev, dias: nuevosDias };
        });
    };

    const onRemoveFranja = (diaIdx: number, franjaIdx: number) => {
        setData((prev) => {
            const nuevosDias = [...prev.dias];
            nuevosDias[diaIdx].franjas = nuevosDias[diaIdx].franjas.filter((_, idx) => idx !== franjaIdx);
            return { ...prev, dias: nuevosDias };
        });
    };

    const onToggleAbierto = (diaIdx: number, checked: boolean) => {
        setData((prev) => {
            const nuevosDias = [...prev.dias];
            nuevosDias[diaIdx].abierto = checked;
            return { ...prev, dias: nuevosDias };
        });
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                showAlert('success', 'Horarios guardados correctamente');
                if (!id) {
                    reset();
                    setResetKey(Date.now());
                }
            },
            onError: (errors: any) => {
                console.error('Error al guardar:', errors);
                showAlert('error', 'Error al guardar los horarios');
            },
        };

        post(route('horarios.store', id), options);
    };

    const handleReset = () => {
        reset();
        setResetKey(Date.now());
    };

    useEffect(() => {
        const onGetItem = async () => {
            reset();

            const { data: response } = await axios.get(route('horarios.show', id));
            const horario = response.data;

            setData({
                dias: horario.map((dia: any) => ({
                    dia: dia.dia,
                    abierto: dia.abierto == 1 ? true : false,
                    franjas: dia.franjas.length
                        ? dia.franjas.map((franja: any) => {
                              return { hora_inicio: franja.hora_inicio, hora_fin: franja.hora_fin };
                          })
                        : [{ hora_inicio: '09:00', hora_fin: '18:00' }],
                })),
                comercio: id,
            });
        };

        if (id) onGetItem();
    }, [id]);

    return (
        <div className="pt-6 pb-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <form onSubmit={submit}>
                    <table className="w-full whitespace-nowrap">
                        <thead>
                            <tr className="text-left font-bold">
                                <th className="px-6 pt-5 pb-4">Día</th>
                                <th className="px-6 pt-5 pb-4">Abierto</th>
                                <th className="px-6 pt-5 pb-4">Horario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.dias.map((dia, diaIdx) => (
                                <tr key={`${dia.dia}-${diaIdx}`} className="hover:bg-gray-50">
                                    <td className="border-t px-6 py-4">{dia.dia}</td>
                                    <td className="border-t px-6 py-4">
                                        <Checkbox checked={dia.abierto} onCheckedChange={(checked) => onToggleAbierto(diaIdx, checked as boolean)} />
                                    </td>
                                    <td className="border-t px-6 py-4">
                                        {dia.franjas.map((franja, franjaIdx) => (
                                            <div key={`${diaIdx}-${franjaIdx}`} className="mb-3 flex items-center gap-3">
                                                <Input
                                                    type="time"
                                                    value={franja.hora_inicio}
                                                    onChange={(e) => onFranjaChange(diaIdx, franjaIdx, 'hora_inicio', e.target.value)}
                                                    disabled={!dia.abierto}
                                                />
                                                <span className="text-gray-500">a</span>
                                                <Input
                                                    type="time"
                                                    value={franja.hora_fin}
                                                    onChange={(e) => onFranjaChange(diaIdx, franjaIdx, 'hora_fin', e.target.value)}
                                                    disabled={!dia.abierto}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveFranja(diaIdx, franjaIdx)}
                                                    disabled={dia.franjas.length <= 1 || !dia.abierto}
                                                >
                                                    <MinusSquare size={18} />
                                                </button>
                                                <button type="button" onClick={() => onCloneFranja(diaIdx, franjaIdx)} disabled={!dia.abierto}>
                                                    <Copy size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={handleReset} disabled={processing}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Horarios'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
