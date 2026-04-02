import { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { type Election, partyColors } from "../data/elections";

interface IndiaMapProps {
  election: Election;
  onStateHover: (state: string | null) => void;
}

// Telangana was carved out of Andhra Pradesh in 2014.
// For elections before 2014, the data only has combined "Andhra Pradesh".
// We need to color the Telangana polygon with AP's data for those years.
// Similarly, Ladakh was carved from J&K in 2019 — for older elections,
// Ladakh should use J&K's data.
function getStateData(
  stateName: string,
  stateResults: Map<string, { winningParty: string; seats: { party: string; count: number }[] }>,
  year: number
) {
  // Direct match first
  const direct = stateResults.get(stateName);
  if (direct) return { result: direct, displayName: stateName };

  // Pre-2014: Telangana didn't exist separately; use Andhra Pradesh data
  if (stateName === "Telangana" && year < 2014) {
    const ap = stateResults.get("Andhra Pradesh");
    if (ap) return { result: ap, displayName: "Andhra Pradesh (undivided)" };
  }

  // Pre-2019: Ladakh was part of Jammu and Kashmir
  if (stateName === "Ladakh" && year < 2019) {
    const jk = stateResults.get("Jammu and Kashmir");
    if (jk) return { result: jk, displayName: "Jammu and Kashmir (undivided)" };
  }

  return null;
}

export default function IndiaMap({ election, onStateHover }: IndiaMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<any>(null);

  const stateResults = useMemo(() => {
    const map = new Map<string, { winningParty: string; seats: { party: string; count: number }[] }>();
    election.states.forEach((s) => {
      map.set(s.state, { winningParty: s.winningParty, seats: s.seats });
    });
    return map;
  }, [election]);

  useEffect(() => {
    fetch("./india-topo.json")
      .then((r) => r.json())
      .then((data) => setGeoData(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 700;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const states = topojson.feature(geoData, geoData.objects["india-states"]) as any;
    const stateBorders = topojson.mesh(
      geoData,
      geoData.objects["india-states"],
      (a: any, b: any) => a !== b
    );

    const projection = d3
      .geoMercator()
      .fitExtent([[20, 20], [width - 20, height - 20]], states);

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    g.selectAll<SVGPathElement, any>("path.state")
      .data(states.features)
      .join("path")
      .attr("class", "state-path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const stateName = d.properties.ST_NM;
        const data = getStateData(stateName, stateResults, election.year);
        if (data) {
          return partyColors[data.result.winningParty] || "#ccc";
        }
        return "hsl(var(--muted))";
      })
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 0.5)
      .on("mouseenter", function (event: MouseEvent, d: any) {
        const stateName = d.properties.ST_NM;
        onStateHover(stateName);
        d3.select(this).attr("stroke-width", 2).attr("stroke", "hsl(var(--foreground))");

        const data = getStateData(stateName, stateResults, election.year);
        if (tooltipRef.current) {
          const tooltip = tooltipRef.current;
          tooltip.style.display = "block";
          tooltip.style.left = `${event.offsetX + 12}px`;
          tooltip.style.top = `${event.offsetY - 10}px`;

          if (data) {
            const displayName = data.displayName;
            const seatsHtml = data.result.seats
              .filter(s => s.count > 0)
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map(
                (s) =>
                  `<span style="color:${partyColors[s.party] || '#999'}">${s.party}</span>: ${s.count}`
              )
              .join(" · ");
            tooltip.innerHTML = `<strong>${displayName}</strong><br/><span style="font-size:11px">${seatsHtml}</span>`;
          } else {
            tooltip.innerHTML = `<strong>${stateName}</strong><br/><span style="font-size:11px;opacity:0.6">No data</span>`;
          }
        }
      })
      .on("mousemove", function (event: MouseEvent) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.offsetX + 12}px`;
          tooltipRef.current.style.top = `${event.offsetY - 10}px`;
        }
      })
      .on("mouseleave", function () {
        onStateHover(null);
        d3.select(this).attr("stroke-width", 0.5).attr("stroke", "hsl(var(--background))");
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "none";
        }
      });

    // State borders
    g.append("path")
      .datum(stateBorders)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 0.8)
      .attr("d", path as any)
      .attr("pointer-events", "none");
  }, [geoData, stateResults, onStateHover, election.year]);

  return (
    <div className="relative" data-testid="india-map">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="w-full max-w-[500px] mx-auto"
        style={{ aspectRatio: "6/7.5" }}
      />
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none hidden z-50 px-3 py-2 rounded-lg text-xs bg-card border border-border shadow-md text-card-foreground"
        style={{ display: "none", maxWidth: 240 }}
      />
    </div>
  );
}
