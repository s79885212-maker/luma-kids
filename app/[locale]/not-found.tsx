import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-primary">404</p>
      <p className="mt-4 text-lg text-muted">Sahifa topilmadi · Страница не найдена</p>
      <Link href="/" className="btn-primary mt-8">Luma Kids</Link>
    </div>
  );
}
