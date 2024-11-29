import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href}>
      <span
        className={cn(
          "px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
          location === href
            ? "bg-primary text-primary-foreground"
            : "text-slate-700 hover:bg-slate-100"
        )}
      >
        {children}
      </span>
    </Link>
  );

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-xl font-bold text-primary cursor-pointer">vSpaceVote</span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/demo">Demo</NavLink>
            <NavLink href="/testing">Testing</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
