import { useState, useMemo, useEffect } from "react";
import { elections, partyColors, type Election } from "../data/elections";
import IndiaMap from "../components/IndiaMap";
import TimelineSlider from "../components/TimelineSlider";
import PartyCards from "../components/PartyCards";
import SeatBar from "../components/SeatBar";
import StateResults from "../components/StateResults";
import CoalitionPanel from "../components/CoalitionPanel";
import ThemeToggle from "../components/ThemeToggle";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Vote,
  TrendingUp,
  Info,
} from "lucide-react";

export default function ElectionExplorer() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(prefersDark);
    if (prefersDark) document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    setIsDark((d) => {
      const next = !d;
      if (next) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  };

  const election = useMemo(
    () => elections.find((e) => e.year === selectedYear)!,
    [selectedYear]
  );

  const electionYears = useMemo(() => elections.map((e) => e.year), []);
  const currentIndex = electionYears.indexOf(selectedYear);

  const goToPrevious = () => {
    if (currentIndex > 0) setSelectedYear(electionYears[currentIndex - 1]);
  };

  const goToNext = () => {
    if (currentIndex < electionYears.length - 1)
      setSelectedYear(electionYears[currentIndex + 1]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const winnerParty = election.parties.find((p) => p.isWinner);

  const formatNumber = (n: number | null) => {
    if (n === null) return "N/A";
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Ashoka Chakra inspired logo */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              className="text-foreground flex-shrink-0"
              fill="none"
              aria-label="India Elections Logo"
            >
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="var(--ashoka-blue)"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="16" cy="16" r="2" fill="var(--ashoka-blue)" />
              {/* 12 spokes */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 16 + 3.5 * Math.cos(angle);
                const y1 = 16 + 3.5 * Math.sin(angle);
                const x2 = 16 + 10.5 * Math.cos(angle);
                const y2 = 16 + 10.5 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="var(--ashoka-blue)"
                    strokeWidth="1.2"
                  />
                );
              })}
            </svg>
            <div>
              <h1 className="text-base font-semibold tracking-tight leading-none">
                India Lok Sabha Elections
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                1951 – 2024
              </p>
            </div>
          </div>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Year Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            data-testid="button-prev-election"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 text-center">
            <div className="text-3xl font-bold tracking-tight tabular-nums">
              {election.year}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {election.primeMinister}
              <span className="mx-1.5 text-muted-foreground/40">·</span>
              <span
                style={{
                  color: partyColors[election.pmParty] || "#999",
                }}
              >
                {election.pmParty}
              </span>
            </div>
          </div>

          <button
            data-testid="button-next-election"
            onClick={goToNext}
            disabled={currentIndex === electionYears.length - 1}
            className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline */}
        <TimelineSlider
          elections={elections}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="stats-row">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Vote className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Total Seats
              </span>
            </div>
            <span className="text-lg font-bold tabular-nums text-foreground">
              {election.totalSeats}
            </span>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Voters
              </span>
            </div>
            <span className="text-lg font-bold tabular-nums text-foreground">
              {formatNumber(election.totalVoters)}
            </span>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Turnout
              </span>
            </div>
            <span className="text-lg font-bold tabular-nums text-foreground">
              {election.turnoutPercentage
                ? `${election.turnoutPercentage.toFixed(1)}%`
                : "N/A"}
            </span>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Majority
              </span>
            </div>
            <span className="text-lg font-bold tabular-nums text-foreground">
              {election.majorityMark}
            </span>
          </div>
        </div>

        {/* Seat Distribution Bar */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Seat Distribution
          </h2>
          <SeatBar election={election} />
        </div>

        {/* Main Content: Map + Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                State-wise Results
              </h2>
              <IndiaMap
                election={election}
                onStateHover={setHoveredState}
              />
            </div>
          </div>

          {/* Right panels */}
          <div className="lg:col-span-7 space-y-6">
            {/* Party Cards */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Top Parties
              </h2>
              <PartyCards election={election} />
            </div>

            {/* Coalitions */}
            <CoalitionPanel election={election} />

            {/* State Results Table */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                State Breakdown
              </h2>
              <StateResults
                election={election}
                highlightedState={hoveredState}
              />
            </div>
          </div>
        </div>

        {/* Election Notes */}
        {election.notes && (
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {election.notes}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-4 text-[11px] text-muted-foreground">
          Data sourced from Election Commission of India records. Use ← → arrow keys to navigate.
        </footer>
      </main>
    </div>
  );
}
