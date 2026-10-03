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
    <footer className="w-full border-t border-outline-variant/40 bg-surface-container-low py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:px-8 lg:flex-row">
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
        <div className="text-center text-sm text-slate-400">© {currentYear} {note}</div>
        <div className="flex flex-wrap justify-center gap-5">
          {links.map((link) => (
            <a
              key={link.label}
              className="inline-flex min-h-11 items-center text-sm text-on-surface-variant transition-colors duration-200 hover:text-primary"
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

