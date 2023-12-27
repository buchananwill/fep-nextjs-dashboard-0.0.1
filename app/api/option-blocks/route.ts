import { NextRequest } from 'next/server';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export async function GET(request: NextRequest) {
  const fullUrl = `${apiBaseUrl}/carousel-groups`;

  try {
    return await fetch(fullUrl, { cache: 'no-store' });
  } catch (e) {
    return { status: 500 };
  }
}
