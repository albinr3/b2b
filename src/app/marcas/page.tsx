'use client';

import Image from 'next/image';
import Link from 'next/link';

// Mock data
const brands = [
    {
        name: 'YR',
        logo: 'https://placehold.co/200x80/png?text=YR',
        description:
            'YR es la marca para el que sabe de calidad y no coge corte con su vehículo. Traemos repuestos premium fabricados con ingeniería de primera, hechos para aguantar la pela de nuestras calles. Cada pieza está probada para dar la talla, garantizando que su carro o camión ande como un general y usted maneje tranquilo.',
        href: '#',
    },
    {
        name: 'ENHD',
        logo: 'https://placehold.co/200x80/png?text=ENHD',
        description:
            'ENHD llegó para resolver. Es la opción inteligente para el que necesita arreglar su vehículo con piezas buenas sin desbaratar el bolsillo. Ofrecemos el balance perfecto entre calidad y precio para que su carro o camión siga rodando sin problemas. Mantenimiento efectivo que cuida su economía.',
        href: '#',
    },
    {
        name: 'ENFULLHD',
        logo: '/ENFULLHD RGB_page-0001.jpg',
        description:
            'ENFULLHD es la marca para poner el vehículo "en alta". Nos enfocamos en accesorios que modernizan la apariencia y funcionalidad de tu auto o camión. Desde iluminación LED de alta definición hasta detalles estéticos que hacen que el vehículo destaque en la calle. Es para el conductor que le gusta andar con su máquina impecable y bien equipada, sin tener que gastar una fortuna.',
        href: '#',
    },
    {
        name: 'TYPE YR',
        logo: '/TYPE YR_page-0001.png',
        description:
            'TYPE YR son los accesorios con carácter. Es la línea pensada para personalizar y darle ese "flow" único a tu vehículo. Ofrecemos detalles de terminación, confort y estética superior para quienes no se conforman con el carro de fábrica. Son esos toques especiales que hacen que, cuando alguien se monte o lo vea pasar, sepa que ese vehículo tiene dueño que lo cuida.',
        href: '#',
    },
    {
        name: 'MH AUDIO',
        logo: '/MH AUDIO_page-0001.png',
        description:
            'MH AUDIO es para que suene nítido sin complicarse la vida. Música buena para disfrutar el viaje o el tapón, con equipos fiables que responden bien. Bajos que se dejan sentir y buena potencia, pero a un precio cómodo. Ideal para el que quiere andar con música, pero cuidando el peso.',
        href: '#',
    },
    {
        name: 'YR AUDIO',
        logo: '/YR AUDIO.png',
        description:
            'YR AUDIO es ligas mayores en sonido. Para el que no juega con su música y quiere que eso suene impecable y duro de verdad. Equipos de alto rendimiento que tiran los bajos profundos y las voces claritas, como tiene que ser. Eleva tu sistema de audio para que cada nota se sienta en el pecho.',
        href: 'https://yraudio.com/',
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
                    {brands.map((brand, index) => {
                        const CardContent = (
                            <>
                                {/* Logo Box */}
                                <div className="w-full sm:w-40 h-32 sm:h-auto shrink-0 bg-slate-50 rounded-lg flex items-center justify-center p-4 border border-slate-100 group-hover:bg-white transition-colors">
                                    <img
                                        src={brand.logo}
                                        alt={`${brand.name} logo`}
                                        className="max-h-28 w-auto object-contain transition-transform duration-500 group-hover:scale-125"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-[#0d151c] mb-2 group-hover:text-[#D00000] transition-colors">
                                        {brand.name}
                                    </h3>
                                    <p className="text-sm text-[#4b779b] mb-4 leading-relaxed">
                                        {brand.description}
                                    </p>
                                </div>
                            </>
                        );

                        return brand.href !== '#' ? (
                            <Link
                                key={index}
                                href={brand.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-white border border-[#e7eef3] hover:border-[#D00000]/30 hover:shadow-lg transition-all duration-300"
                            >
                                {CardContent}
                            </Link>
                        ) : (
                            <div
                                key={index}
                                className="group relative flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-white border border-[#e7eef3] hover:border-[#D00000]/30 hover:shadow-lg transition-all duration-300"
                            >
                                {CardContent}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
