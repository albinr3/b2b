'use client';

import Image from 'next/image';
import Link from 'next/link';

// Mock data
const brands = [
    {
        name: 'Jayaco',
        logo: 'https://placehold.co/200x80/png?text=JAYACO',
        description: 'Marca líder en piezas de repuestos para motores y pasolas.',
        href: '#',
    },
    {
        name: 'Tanaka',
        logo: 'https://placehold.co/200x80/png?text=TANAKA',
        description: 'Marca más completa en piezas de reemplazo para motores y pasolas del mercado dominicano.',
        href: '#',
    },
    {
        name: 'Miyazuka',
        logo: 'https://placehold.co/200x80/png?text=MIYAZUKA',
        description: 'Línea de productos que satisface las demandas de repuestos para motores.',
        href: '#',
    },
    {
        name: 'Chaoyang',
        logo: 'https://placehold.co/200x80/png?text=CHAOYANG',
        description: 'Somos los distribuidores autorizados en el país de la marca Chaoyang Tyres.',
        href: '#',
    },
    {
        name: 'Maxxis',
        logo: 'https://placehold.co/200x80/png?text=MAXXIS',
        description: 'Colocada como la número 9 en la lista de fabricantes más grandes del mundo.',
        href: '#',
    },
    {
        name: 'CST',
        logo: 'https://placehold.co/200x80/png?text=CST',
        description: 'Distribuido en más de 150 países, la marca CST cubre una amplia gama de segmentos.',
        href: '#',
    },
    {
        name: 'LP Audio',
        logo: 'https://placehold.co/200x80/png?text=LP+AUDIO',
        description: 'Marca propia centrada en la innovación para el desarrollo de productos de calidad.',
        href: '#',
    },
    {
        name: 'Black-B',
        logo: 'https://placehold.co/200x80/png?text=Black-B',
        description: 'Línea especializada en accesorios y productos electrónicos de automóviles.',
        href: '#',
    },
];

export default function MarcasPage() {
    return (
        <div className="bg-[#f8f9fa] min-h-screen py-20">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-[#e7eef3] pb-8">
                    <div className="max-w-2xl">
                        <span className="text-[#D00000] font-bold text-sm tracking-widest uppercase mb-2 block">
                            Nuestros Aliados
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-[#0d151c] tracking-tight leading-tight">
                            Marcas que mueven <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d151c] to-slate-500">el mundo automotriz</span>
                        </h1>
                    </div>
                    <p className="text-[#4b779b] text-sm md:text-right max-w-md pb-1 leading-relaxed">
                        Seleccionamos rigurosamente a nuestros proveedores para ofrecerte solo lo mejor en durabilidad y rendimiento.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {brands.map((brand, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-white border border-[#e7eef3] hover:border-[#D00000]/30 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Logo Box */}
                            <div className="w-full sm:w-40 h-32 sm:h-auto shrink-0 bg-slate-50 rounded-lg flex items-center justify-center p-4 border border-slate-100 group-hover:bg-white transition-colors">
                                <img
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    className="max-h-16 w-auto object-contain filter grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-xl font-bold text-[#0d151c] mb-2 group-hover:text-[#D00000] transition-colors">
                                    {brand.name}
                                </h3>
                                <p className="text-sm text-[#4b779b] mb-4 leading-relaxed line-clamp-2">
                                    {brand.description}
                                </p>

                                <Link
                                    href={brand.href}
                                    className="inline-flex items-center text-xs font-bold text-[#0d151c] uppercase tracking-wider border-b border-[#D00000] pb-0.5 hover:text-[#D00000] transition-colors"
                                >
                                    Ver catálogo
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
