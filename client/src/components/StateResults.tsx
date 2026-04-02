import { type Election, partyColors } from "../data/elections";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

interface StateResultsProps {
  election: Election;
  highlightedState: string | null;
}

export default function StateResults({ election, highlightedState }: StateResultsProps) {
  const [search, setSearch] = useState("");

  const filteredStates = useMemo(() => {
    const sorted = [...election.states].sort((a, b) => {
      const aTotal = a.seats.reduce((sum, s) => sum + s.count, 0);
      const bTotal = b.seats.reduce((sum, s) => sum + s.count, 0);
      return bTotal - aTotal;
    });
    if (!search) return sorted;
    return sorted.filter((s) =>
      s.state.toLowerCase().includes(search.toLowerCase())
    );
  }, [election, search]);

  return (
    <div data-testid="state-results">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          data-testid="input-state-search"
          type="search"
          placeholder="Search states..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-muted border-0 outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
        {filteredStates.map((s) => {
          const totalSeats = s.seats.reduce((sum, seat) => sum + seat.count, 0);
          const isHighlighted = highlightedState === s.state;
          const sortedSeats = [...s.seats]
            .filter(seat => seat.count > 0)
            .sort((a, b) => b.count - a.count);

          return (
            <div
              key={s.state}
              data-testid={`state-row-${s.state}`}
              className={`
                rounded-md px-3 py-2 transition-colors
                ${isHighlighted
                  ? "bg-[var(--saffron)]/10 border border-[var(--saffron)]/30"
                  : "hover:bg-muted/60 border border-transparent"
                }
              `}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-sm flex-shrink-0"
                    style={{
                      backgroundColor: partyColors[s.winningParty] || "#999",
                    }}
                  />
                  <span className="text-xs font-medium text-foreground">
                    {s.state}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {totalSeats} seats
                </span>
              </div>

              {/* Mini bar */}
              <div className="h-1.5 rounded-full overflow-hidden bg-muted flex">
                {sortedSeats.map((seat) => (
                  <div
                    key={seat.party}
                    className="h-full"
                    style={{
                      width: `${(seat.count / totalSeats) * 100}%`,
                      backgroundColor: partyColors[seat.party] || "#999",
                    }}
                    title={`${seat.party}: ${seat.count}`}
                  />
                ))}
              </div>

              {/* Party breakdown */}
              <div className="flex flex-wrap gap-x-2 gap-y-0 mt-1">
                {sortedSeats.slice(0, 4).map((seat) => (
                  <span key={seat.party} className="text-[10px] text-muted-foreground tabular-nums">
                    <span style={{ color: partyColors[seat.party] || "#999" }}>
                      {seat.party}
                    </span>{" "}
                    {seat.count}
                  </span>
                ))}
                {sortedSeats.length > 4 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{sortedSeats.length - 4}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {filteredStates.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No states found
          </p>
        )}
      </div>
    </div>
  );
}
