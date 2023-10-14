import { cookies } from 'next/headers';

export default function CookieStore() {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme');
  return (
    <div>
      <p>
        {theme?.name}
        {theme?.value}
      </p>
    </div>
  );
}
