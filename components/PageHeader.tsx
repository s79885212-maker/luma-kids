import { Bubbles } from "./Bubbles";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative overflow-hidden">
      <Bubbles variant="header" />
      <div className="container-page relative pb-6 pt-8 sm:pt-12">
        <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          {title}
          <span className="ml-1 inline-block size-3 rounded-full bg-accent align-baseline" aria-hidden />
        </h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
