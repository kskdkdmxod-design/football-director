import Link from "next/link";
import { useRouter } from "next/router";

const ITEMS = [
  { href: "/", label: "Ana sayfa" },
  { href: "/kadro", label: "Kadro" },
  { href: "/transfer", label: "Transfer" },
  { href: "/finans", label: "Finans" },
];

export default function BottomNav() {
  const router = useRouter();
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={router.pathname === item.href ? "active" : ""}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
