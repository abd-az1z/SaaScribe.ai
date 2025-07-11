import { notFound } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound();
  }
  
  return null;
}
