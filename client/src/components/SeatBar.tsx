import { type Election, partyColors } from "../data/elections";
import { useMemo } from "react";

interface SeatBarProps {
  election: Election;
}

export default function SeatBar({ election }: SeatBarProps) {
  const sortedParties = useMemo(() => {
    return [...election.parties]
      .filter((p) => p.seats > 0)
      .sort((a, b) => b.seats - a.seats);
  }, [election]);

  const majorityMark = election.majorityMark;
  const majorityPercent = (majorityMark / election.totalSeats) * 100;

  return (
    <div className="space-y-2" data-testid="seat-bar">
      {/* Bar */}
      <div className="relative h-8 rounded-lg overflow-hidden bg-muted flex">
        {sortedParties.map((p) => {
          const widthPercent = (p.seats / election.totalSeats) * 100;
          if (widthPercent < 0.3) return null;
          return (
            <div
              key={p.party}
              className="seat-bar h-full relative group"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: partyColors[p.party] || "#999",
              }}
              title={`${p.party}: ${p.seats} seats`}
            >
              {widthPercent > 6 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white drop-shadow-sm">
                  {p.seats}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Majority line */}
      <div className="relative h-4">
        <div
          className="absolute top-0 w-px h-3 bg-foreground/60"
          style={{ left: `${majorityPercent}%` }}
        />
        <span
          className="absolute top-3 text-[9px] text-muted-foreground -translate-x-1/2 whitespace-nowrap"
          style={{ left: `${majorityPercent}%` }}
        >
          Majority: {majorityMark}
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
        {sortedParties.slice(0, 8).map((p) => (
          <div key={p.party} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: partyColors[p.party] || "#999" }}
            />
            <span className="text-[11px] text-muted-foreground">
              {p.party}{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {p.seats}
              </span>
            </span>
          </div>
        ))}
        {sortedParties.length > 8 && (
          <span className="text-[11px] text-muted-foreground">
            +{sortedParties.length - 8} more
          </span>
        )}
      </div>
    </div>
  );
}
