interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-b-4 border-fisch-yellow bg-fisch-black text-fisch-white">
      <div className="container-fisch py-14 sm:py-20">
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-wider text-fisch-yellow">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-fisch-white/75 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
