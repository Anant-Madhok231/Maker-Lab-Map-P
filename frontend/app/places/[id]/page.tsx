import { PlaceDetailClient } from "@/app/places/[id]/place-detail-client";
import { staticPlaces } from "@/lib/static-search";

type PlaceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return staticPlaces.map((place) => ({
    id: place.id,
  }));
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { id } = await params;

  return <PlaceDetailClient placeId={id} />;
}
