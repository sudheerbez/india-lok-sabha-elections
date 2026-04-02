import { useMemo } from "react";
import { type Election } from "../data/elections";

interface TimelineSliderProps {
  elections: Election[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export default function TimelineSlider({
  elections,
  selectedYear,
  onYearChange,
}: TimelineSliderProps) {
  const years = useMemo(() => elections.map((e) => e.year), [elections]);
  const projectedYears = useMemo(
    () => new Set(elections.filter((e) => e.isProjected).map((e) => e.year)),
    [elections]
  );

  return (
    <div className="w-full" data-testid="timeline-slider">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 overflow-x-auto py-2">
          <div className="flex items-center gap-0 min-w-0">
            {years.map((year, i) => {
              const isSelected = year === selectedYear;
              const isDecade = year % 10 === 0 || year === 1951;
              const isProjected = projectedYears.has(year);
              return (
                <button
                  key={year}
                  data-testid={`timeline-year-${year}`}
                  onClick={() => onYearChange(year)}
                  className={`
                    relative flex-shrink-0 flex flex-col items-center transition-all duration-200
                    ${isSelected ? "z-10" : "z-0"}
                  `}
                  style={{ width: `${100 / years.length}%`, minWidth: 32 }}
                >
                  {/* Dot */}
                  <div
                    className={`
                      rounded-full transition-all duration-200
                      ${isSelected && isProjected
                        ? "w-3 h-3 bg-amber-500 ring-2 ring-amber-500 ring-offset-2 ring-offset-background"
                        : isSelected
                          ? "w-3 h-3 bg-[var(--saffron)] ring-2 ring-[var(--saffron)] ring-offset-2 ring-offset-background"
                          : isProjected
                            ? "w-2.5 h-2.5 bg-amber-400/60 border border-dashed border-amber-500 hover:bg-amber-400/80"
                            : "w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                      }
                    `}
                  />
                  {/* Year label */}
                  <span
                    className={`
                      mt-1.5 text-[10px] leading-none timeline-year transition-all
                      ${isSelected && isProjected
                        ? "text-amber-600 dark:text-amber-400 font-semibold text-xs"
                        : isSelected
                          ? "text-foreground font-semibold text-xs"
                          : isProjected
                            ? "text-amber-500/70 font-medium"
                            : isDecade
                              ? "text-muted-foreground font-medium"
                              : "text-transparent sm:text-muted-foreground/50"
                      }
                    `}
                  >
                    {isSelected || isDecade || isProjected ? year : `'${String(year).slice(2)}`}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Track line */}
          <div className="absolute top-[17px] left-4 right-4 h-px bg-border -z-10" />
        </div>
      </div>
    </div>
  );
}
