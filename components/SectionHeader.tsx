import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="heading flex items-center gap-2">
        <span className="inline-block size-3 shrink-0 rounded-full bg-brand" aria-hidden />
        {title}
      </h2>
      {href && linkLabel && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline">
          {linkLabel} <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
