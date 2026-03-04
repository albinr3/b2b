import { redirect } from 'next/navigation';
import { getCatalogSession } from '@/lib/catalog-auth';
import LoginForm from './LoginForm';

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function CatalogLoginPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  const session = await getCatalogSession();
  if (session) {
    redirect(callbackUrl || '/catalogo');
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e7eef3] bg-white p-8 shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#0d151c]">Acceso al catálogo</h1>
          <p className="text-sm text-[#4b779b] mt-2">
            Ingresa tu código de cliente para continuar.
          </p>
        </div>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
