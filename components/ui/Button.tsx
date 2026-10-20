import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "whatsapp" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 font-sans text-sm font-medium transition-all duration-300 select-none";

const variants: Record<Variant, string> = {
  primary:
    "rounded-full bg-espresso text-ivory px-7 py-3.5 hover:bg-ink hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(36,28,21,0.6)]",
  gold:
    "rounded-full bg-saffron text-espresso font-semibold px-7 py-3.5 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_36px_-14px_rgba(196,137,46,0.75)]",
  outline:
    "rounded-full border border-saffron text-espresso px-7 py-3.5 hover:bg-[var(--saffron-soft)] hover:-translate-y-0.5",
  whatsapp:
    "rounded-full bg-[#25D366] text-white px-6 py-3.5 hover:brightness-105 hover:-translate-y-0.5 hover:shadow-lg",
  ghost: "text-espresso link-underline px-0 py-1",
};

type CommonProps = { variant?: Variant; className?: string; children: React.ReactNode };
type AsLink = CommonProps & { href: string; external?: boolean } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className"
  >;
type AsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: undefined };

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, children } = props;
  const classes = cn(base, variants[variant], className);

  if ("href" in props && props.href) {
    const { href, external, variant: _v, className: _c, children: _ch, ...rest } = props as AsLink;
    const isExternal =
      external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props as AsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
