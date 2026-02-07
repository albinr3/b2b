import LoginForm from './LoginForm';

export default function AdminLoginPanel() {
  return (
    <div className="min-h-screen w-full bg-[#0b0f14] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1e2a36] bg-white p-8 shadow-2xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8aa4b8]">Admin</p>
          <h1 className="text-2xl font-black text-[#0d151c] mt-2">Acceso al panel</h1>
          <p className="text-sm text-[#4b779b] mt-2">
            Ingresa tus credenciales para continuar.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
