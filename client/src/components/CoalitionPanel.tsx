import { type Election, partyColors } from "../data/elections";

interface CoalitionPanelProps {
  election: Election;
}

export default function CoalitionPanel({ election }: CoalitionPanelProps) {
  if (!election.coalitions || election.coalitions.length === 0) return null;

  return (
    <div className="space-y-2" data-testid="coalition-panel">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Coalitions
      </h3>
      <div className="space-y-2">
        {election.coalitions.map((c) => {
          const isRuling = c.totalSeats >= election.majorityMark;
          return (
            <div
              key={c.name}
              className={`
                rounded-lg border p-3
                ${isRuling
                  ? "border-[var(--saffron)]/30 bg-[var(--saffron)]/5"
                  : "border-border bg-card"
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {c.name}
                  </span>
                  {isRuling && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--saffron)]/20 text-[var(--saffron)] font-medium">
                      RULING
                    </span>
                  )}
                </div>
                <span className="text-base font-bold tabular-nums text-foreground">
                  {c.totalSeats}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {c.parties.slice(0, 8).map((party) => (
                  <span
                    key={party}
                    className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: partyColors[party] || "#999",
                      }}
                    />
                    {party}
                  </span>
                ))}
                {c.parties.length > 8 && (
                  <span className="text-[10px] text-muted-foreground px-1">
                    +{c.parties.length - 8}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
