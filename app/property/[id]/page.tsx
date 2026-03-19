import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { getListing, getListings, listingToProperty } from '@/lib/api';
import { featuredProperties, latestProperties } from '@/lib/data';
import PropertyClient from './property-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://holanu.id';

const getStaticProperty = (id: string) => {
  const all = [...featuredProperties, ...latestProperties.filter(p => !featuredProperties.find(f => f.id === p.id))];
  return all.find(p => p.id === id);
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let property: any = null;

  try {
    const raw = await getListing(params.id);
    property = listingToProperty(raw);
  } catch {
    property = getStaticProperty(params.id);
  }

  if (!property) return { title: 'Properti Tidak Ditemukan — HOLANU' };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', maximumFractionDigits: 0 }).format(n);

  const code        = property.code ?? `HOL-${property.id.padStart(4, '0')}`;
  const url         = `${SITE_URL}/property/${params.id}`;
  const title       = `${property.title} — ${formatPrice(property.price)}`;
  const description = `${property.propertyType} ${property.offerType} di ${property.location}. Kode: ${code}`;
  const ogImage     = property.image?.startsWith('/') ? `${SITE_URL}${property.image}` : property.image;

  return {
    title,
    description,
    openGraph: { title, description, url, siteName: 'HOLANU', images: [{ url: ogImage, width: 1200, height: 630, alt: property.title }], locale: 'id_ID', type: 'article' },
    twitter:   { card: 'summary_large_image', title, description, images: [ogImage] },
    alternates: { canonical: url },
  };
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  let property: any  = null;
  let related: any[] = [];

  try {
    const raw = await getListing(params.id);
    property  = listingToProperty(raw);
    const res = await getListings({ city: raw.city ?? '', limit: 4 });
    related   = res.listings
      .filter(l => l.id !== params.id)
      .slice(0, 4)
      .map(listingToProperty);
  } catch {
    property = getStaticProperty(params.id);
    if (property) {
      const all = [...featuredProperties, ...latestProperties.filter(p => !featuredProperties.find(f => f.id === p.id))];
      related = all.filter(p => p.location === property.location && p.id !== params.id).slice(0, 4);
    }
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-[#EFF6FF]">
          <div className="text-center px-4 max-w-md">
            <p className="text-5xl mb-4">🏚️</p>
            <h1 className="font-heading font-bold text-2xl text-[#1E3A8A] mb-2">Properti Tidak Ditemukan</h1>
            <p className="text-slate-500 font-sans mb-6 text-sm">Properti ini tidak tersedia atau sudah dihapus.</p>
            <Link href="/" className="bg-[#1D4ED8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1E40AF] transition-colors font-sans text-sm">
              🏠 Kembali ke Beranda
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return <PropertyClient property={property} related={related} />;
}
