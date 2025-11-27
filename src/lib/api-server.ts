// Server-side API calls for SSR
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://wbmrapi.fly0.tech';

export async function fetchGroupedRoads(params: {
  skip?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  letter?: string;
}) {
  const { skip = 0, limit = 20, sortBy = 'road_name', sortOrder = 'asc', letter } = params;

  const searchParams = new URLSearchParams({
    grouped: 'true',
    skip: skip.toString(),
    limit: limit.toString(),
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  if (letter) {
    searchParams.append('letter', letter);
  }

  const response = await fetch(`${API_BASE_URL}/roads?${searchParams.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch roads');
  }

  return response.json();
}

export async function fetchRoadBySlug(slug: string) {
  const response = await fetch(`${API_BASE_URL}/roads/road/${slug}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch road');
  }

  return response.json();
}

export async function fetchRoadSegments(slug: string, params: { skip?: number; limit?: number } = {}) {
  const { skip = 0, limit = 100 } = params;

  const response = await fetch(
    `${API_BASE_URL}/roads/road/${slug}/segments?skip=${skip}&limit=${limit}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch road segments');
  }

  return response.json();
}

export async function fetchAllRoadSlugs() {
  const response = await fetch(`${API_BASE_URL}/roads?grouped=true&skip=0&limit=10000`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch road slugs');
  }

  const data = await response.json();
  return data.data.roads.map((road: any) => road.road_slug);
}
