interface SectionHeaderProps {
  hiTitle: string;
  enTitle: string;
  sectionNumber?: string;
}

export function SectionHeader({ hiTitle, enTitle, sectionNumber }: SectionHeaderProps) {
  return (
    <div className="relative py-6">
      {/* Decorative line */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative">
        <div className="bg-bg px-4 inline-block">
          {sectionNumber && (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-navy-800 text-white text-xs font-bold mr-2">
              {sectionNumber}
            </span>
          )}
          <h2 className="inline text-lg font-bold text-navy-800">
            {hiTitle}
          </h2>
        </div>
        <div className="mt-0.5 pl-4">
          <p className="text-sm text-text-muted">{enTitle}</p>
        </div>
      </div>
    </div>
  );
}
