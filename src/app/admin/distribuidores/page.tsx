import { prisma } from '@/lib/prisma';
import DistributorsClient from './DistributorsClient';

export default async function AdminDistribuidoresPage() {
  const distributors = await prisma.distributor.findMany({
    orderBy: { name: 'asc' },
  });

  return <DistributorsClient distributors={distributors} />;
}
