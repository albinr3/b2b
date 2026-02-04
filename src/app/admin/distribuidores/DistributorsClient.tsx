'use client';

import { useActionState, useEffect } from 'react';
import {
  createDistributorAction,
  deleteDistributorAction,
  updateDistributorAction,
} from '@/lib/admin-actions';
import { useToast } from '@/components/ToastProvider';

type DistributorItem = {
  id: number;
  name: string;
  region: string;
  phone: string;
  email: string;
  address: string;
};

export default function DistributorsClient({ distributors }: { distributors: DistributorItem[] }) {
  const { push } = useToast();
  const [createState, createAction] = useActionState(createDistributorAction, {
    ok: false,
    message: '',
  });

  useEffect(() => {
    if (!createState?.message) return;
    push(createState.message, createState.ok ? 'success' : 'error');
  }, [createState, push]);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0d151c] mb-4">Nuevo distribuidor</h2>
        <form action={createAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            placeholder="Nombre"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <input
            name="region"
            placeholder="Provincia o región"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <input
            name="phone"
            placeholder="Teléfono"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <input
            name="email"
            placeholder="Email"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <input
            name="address"
            placeholder="Dirección"
            className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#D00000] text-white font-semibold hover:bg-[#b00000]"
          >
            Guardar distribuidor
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-[#e7eef3] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0d151c] mb-4">Distribuidores existentes</h2>
        <div className="flex flex-col gap-4">
          {distributors.length === 0 && (
            <p className="text-sm text-[#4b779b]">Aún no hay distribuidores registrados.</p>
          )}
          {distributors.map((distributor) => (
            <DistributorRow key={distributor.id} distributor={distributor} onToast={push} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DistributorRow({
  distributor,
  onToast,
}: {
  distributor: DistributorItem;
  onToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const [updateState, updateAction] = useActionState(updateDistributorAction, {
    ok: false,
    message: '',
  });
  const [deleteState, deleteAction] = useActionState(deleteDistributorAction, {
    ok: false,
    message: '',
  });

  useEffect(() => {
    if (!updateState?.message) return;
    onToast(updateState.message, updateState.ok ? 'success' : 'error');
  }, [updateState, onToast]);

  useEffect(() => {
    if (!deleteState?.message) return;
    onToast(deleteState.message, deleteState.ok ? 'success' : 'error');
  }, [deleteState, onToast]);

  return (
    <div className="rounded-xl border border-[#e7eef3] p-4 flex flex-col gap-4">
      <form action={updateAction} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input type="hidden" name="id" value={distributor.id} />
        <input
          name="name"
          defaultValue={distributor.name}
          className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
        <input
          name="region"
          defaultValue={distributor.region}
          className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
        <input
          name="phone"
          defaultValue={distributor.phone}
          className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
        <input
          name="email"
          defaultValue={distributor.email}
          className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
        <input
          name="address"
          defaultValue={distributor.address}
          className="h-10 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
        <button
          type="submit"
          className="h-10 rounded-lg border border-[#D00000] text-[#D00000] font-semibold hover:bg-[#D00000] hover:text-white transition-colors"
        >
          Actualizar
        </button>
      </form>
      <form action={deleteAction} className="flex justify-end">
        <input type="hidden" name="id" value={distributor.id} />
        <button
          type="submit"
          className="h-10 rounded-lg border border-[#e7eef3] px-4 text-sm font-semibold text-[#0d151c] hover:border-[#D00000] hover:text-[#D00000] transition-colors"
        >
          Eliminar
        </button>
      </form>
    </div>
  );
}
