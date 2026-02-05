'use client';

import Link from 'next/link';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    basePath: string;
};

export default function Pagination({
    currentPage,
    totalPages,
    basePath,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
        <div className="flex items-center justify-between gap-4 mt-6">
            <div className="text-sm text-[#4b779b]">
                Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
                {prevPage ? (
                    <Link
                        href={`${basePath}?page=${prevPage}`}
                        className="h-10 px-4 rounded-lg border border-[#cfdde8] text-sm font-medium text-[#0d151c] hover:border-[#D00000] hover:text-[#D00000] transition-colors flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        Anterior
                    </Link>
                ) : (
                    <span className="h-10 px-4 rounded-lg border border-[#e7eef3] text-sm font-medium text-[#a0aab4] flex items-center gap-1 cursor-not-allowed">
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        Anterior
                    </span>
                )}
                {nextPage ? (
                    <Link
                        href={`${basePath}?page=${nextPage}`}
                        className="h-10 px-4 rounded-lg border border-[#cfdde8] text-sm font-medium text-[#0d151c] hover:border-[#D00000] hover:text-[#D00000] transition-colors flex items-center gap-1"
                    >
                        Siguiente
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </Link>
                ) : (
                    <span className="h-10 px-4 rounded-lg border border-[#e7eef3] text-sm font-medium text-[#a0aab4] flex items-center gap-1 cursor-not-allowed">
                        Siguiente
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </span>
                )}
            </div>
        </div>
    );
}
