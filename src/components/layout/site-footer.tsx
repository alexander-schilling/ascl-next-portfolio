import Image from "next/image";

type FooterLink = {
  label: string;
  href: string;
};

type SiteFooterProps = {
  brand: string;
  brandLogoUrl: string;
  note: string;
  links: FooterLink[];
};

export function SiteFooter({ brand, brandLogoUrl, note, links }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-8 md:flex-row">
        <div className="font-headline text-lg text-slate-200">
          {brandLogoUrl
            ? (
                <Image
                  src={brandLogoUrl}
                  alt={`${brand} logo`}
                  width={120}
                  height={36}
                  className="h-7 w-auto object-contain"
                  sizes="120px"
                />
              )
            : brand}
        </div>
        <div className="text-sm text-slate-400">© {currentYear} {note}</div>
        <div className="flex gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              className="text-slate-500 transition-colors duration-200 hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

