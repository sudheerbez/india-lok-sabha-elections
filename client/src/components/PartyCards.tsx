import { type Election, partyColors } from "../data/elections";
import { useMemo } from "react";
import { Crown } from "lucide-react";

interface PartyCardsProps {
  election: Election;
}

const partyFullNames: Record<string, string> = {
  INC: "Indian National Congress",
  BJP: "Bharatiya Janata Party",
  JNP: "Janata Party",
  JD: "Janata Dal",
  BJS: "Bharatiya Jana Sangh",
  SWA: "Swatantra Party",
  CPI: "Communist Party of India",
  CPM: "CPI (Marxist)",
  DMK: "Dravida Munnetra Kazhagam",
  AIADMK: "All India Anna DMK",
  TMC: "Trinamool Congress",
  SP: "Samajwadi Party",
  BSP: "Bahujan Samaj Party",
  TDP: "Telugu Desam Party",
  NCP: "Nationalist Congress Party",
  JDU: "Janata Dal (United)",
  SS: "Shiv Sena",
  SAD: "Shiromani Akali Dal",
  RJD: "Rashtriya Janata Dal",
  YSRCP: "YSR Congress Party",
  BJD: "Biju Janata Dal",
  AAP: "Aam Aadmi Party",
  IND: "Independents",
  OTH: "Others",
  PSP: "Praja Socialist Party",
  KMPP: "Kisan Mazdoor Praja Party",
  SSP: "Samyukta Socialist Party",
  NCO: "Nehru Congress (O)",
  "JNP(S)": "Janata Party (Secular)",
  TRS: "Telangana Rashtra Samithi",
  IUML: "Indian Union Muslim League",
  RSP: "Revolutionary Socialist Party",
  FBL: "Forward Bloc",
  JMM: "Jharkhand Mukti Morcha",
  INLD: "Indian National Lok Dal",
  LJP: "Lok Janshakti Party",
  JKNC: "J&K National Conference",
  AGP: "Asom Gana Parishad",
  "SHS(UBT)": "Shiv Sena (UBT)",
  NCPSP: "NCP (Sharadchandra Pawar)",
};

export default function PartyCards({ election }: PartyCardsProps) {
  const topParties = useMemo(() => {
    return [...election.parties]
      .sort((a, b) => b.seats - a.seats)
      .slice(0, 6);
  }, [election]);

  const winner = topParties.find((p) => p.isWinner);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" data-testid="party-cards">
      {topParties.map((p) => {
        const color = partyColors[p.party] || "#999";
        const isWinner = p.isWinner;
        return (
          <div
            key={p.party}
            data-testid={`party-card-${p.party}`}
            className={`
              relative rounded-lg border p-3 transition-all
              ${isWinner
                ? "border-[var(--saffron)]/40 bg-[var(--saffron)]/5 dark:bg-[var(--saffron)]/10"
                : "border-border bg-card"
              }
            `}
          >
            {isWinner && (
              <div className="absolute top-2 right-2">
                <Crown className="w-3.5 h-3.5 text-[var(--saffron)]" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-semibold text-foreground truncate">
                {p.party}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground truncate mb-2 leading-tight">
              {partyFullNames[p.party] || p.party}
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-xl font-bold tabular-nums"
                style={{ color }}
              >
                {p.seats}
              </span>
              <span className="text-[11px] text-muted-foreground">seats</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 tabular-nums">
              {p.voteShare.toFixed(1)}% vote share
            </div>
          </div>
        );
      })}
    </div>
  );
}
