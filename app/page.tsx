import Image from "next/image";
import { StarIcon, MapPinIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

export const revalidate = 86_400;

interface Place {
  name: string;
  photo?: {
    url: string;
  };
  rating: number;
  user_ratings_total: number;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  reviews?: Array<{
    text: string;
    author_name: string;
  }>;
}

interface LoadResult {
  data?: {
    results: Place[];
    query: string;
  };
}

function titleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function load(): Promise<LoadResult | null> {
  try {
    const res = await fetch(`https://mapmind-seven.vercel.app/api/v1/${process.env.NEXT_PUBLIC_APP_NAME}`)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Failed to fetch data:", error)
    return null
  }
}

export default async function Home() {
  const data = await load();
  const places = data?.data?.results || [];
  const query = data?.data?.query || "";

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{titleCase(query)}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place: Place, index: number) => (
              <div key={index} className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    {place.photo && (
                      <Image
                        src={place.photo.url}
                        alt={place.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{place.name}</h2>
                      <div className="flex items-center mt-1">
                        <StarIcon className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600">{place.rating} ({place.user_ratings_total} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {place.formatted_address}
                    </p>
                    {place.formatted_phone_number && (
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {place.formatted_phone_number}
                      </p>
                    )}
                    {place.website && (
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
                      >
                        <GlobeAltIcon className="h-4 w-4 mr-1" />
                        Visit Website
                      </a>
                    )}
                  </div>
                  {place.reviews && place.reviews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 italic">&apos;{place.reviews[0].text.slice(0, 100)}...&apos;</p>
                      <p className="text-xs text-gray-500 mt-1">- {place.reviews[0].author_name}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
