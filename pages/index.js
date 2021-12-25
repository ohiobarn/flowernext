import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/api/auth/login"><a>Login</a></Link> | <Link href="/api/auth/logout"><a>Logout</a></Link> | <Link href="/profile"><a>Profile</a></Link>
    </div>
  );
}
