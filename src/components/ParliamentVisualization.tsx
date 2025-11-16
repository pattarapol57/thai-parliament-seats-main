import { useState } from "react";
import { MP, LayoutType, VoteType } from "@/types/parliament";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X, Minus, Ban, UserX } from "lucide-react";

interface ParliamentVisualizationProps {
  mps: MP[];
  layout: LayoutType;
  onMPClick: (mp: MP) => void;
  filterParty?: string | string[];
  filterVote?: VoteType | VoteType[];
  highlightedMPId?: string | null;
  highlightedMPIds?: string[];
}

const ParliamentVisualization = ({
  mps,
  layout,
  onMPClick,
  filterParty,
  filterVote,
  highlightedMPId,
  highlightedMPIds = [],
}: ParliamentVisualizationProps) => {
  const [hoveredMP, setHoveredMP] = useState<string | null>(null);

  const filteredMPs = mps.filter((mp) => {
    const parties = Array.isArray(filterParty) ? filterParty : filterParty ? [filterParty] : [];
    const votes = Array.isArray(filterVote) ? filterVote : filterVote ? [filterVote] : [];

    const partyMatch = parties.length === 0 || parties.includes(mp.party);
    const voteMatch = votes.length === 0 || votes.includes(mp.vote);

    return partyMatch && voteMatch;
  });

  // Sort MPs by party for better visualization grouping
  const sortedMPs = [...mps].sort((a, b) => {
    // First sort by party
    const partyCompare = a.party.localeCompare(b.party);
    if (partyCompare !== 0) return partyCompare;
    // Then by vote type
    const voteOrder = { agree: 0, disagree: 1, abstain: 2, "no-vote": 3, absent: 4 };
    return voteOrder[a.vote] - voteOrder[b.vote];
  });

  const getPartyColor = (party: string) => {
    const partyKey = party.toLowerCase().replace(/\s+/g, "-");

    const partyColors: { [key: string]: string } = {
      "pheu-thai-party": "bg-[hsl(var(--party-pheu-thai))] hover:opacity-80",
      "move-forward-party": "bg-[hsl(var(--party-move-forward))] hover:opacity-80",
      "united-thai-nation-party": "bg-[hsl(var(--party-united-thai))] hover:opacity-80",
      "democrat-party": "bg-[hsl(var(--party-democrat))] hover:opacity-80",
      "bhumjaithai-party": "bg-[hsl(var(--party-bhumjaithai))] hover:opacity-80",
      "palang-pracharath-party": "bg-[hsl(var(--party-palang-pracharath))] hover:opacity-80",
      "thai-sang-thai-party": "bg-[hsl(var(--party-thai-sang-thai))] hover:opacity-80",
      "prachachat-party": "bg-[hsl(var(--party-prachachat))] hover:opacity-80",
    };

    return partyColors[partyKey] || "bg-muted hover:opacity-80";
  };

  const getPartyColorValue = (party: string) => {
    const partyKey = party.toLowerCase().replace(/\s+/g, "-");

    const partyColorValues: { [key: string]: string } = {
        "ประชาชน": "#ff0055",
        "ใหม่": "#8b00ff",
        "เสรีรวมไทย": "#1e90ff",
        "พลังสังคมใหม่": "#ff8c00",
        "เป็นธรรม": "#00aa88",
        "ประชาธิปไตยใหม่": "#f4c542",
        "ท้องที่ไทย": "#0db7af",
        "ครูไทยเพื่อประชาชน": "#5c6bc0",
        "เพื่อไทรวมพลัง": "#00c7ff",
        "ชาติพัฒนากล้า": "#cc5500",
        "ไทยสร้างไทย": "#ff6699",
        "ประชาชาติ": "#006600",
        "ชาติไทยพัฒนา": "#00aaff",
        "ประชาธิปัตย์": "#003399",
        "รวมไทยสร้างชาติ": "#002868",
        "พลังประชารัฐ": "#0066cc",
        "ภูมิใจไทย": "#0099cc",
        "เพื่อไทย": "#cc0000",
    };

    return partyColorValues[partyKey] || "hsl(240, 5%, 65%)";
  };

  const getVoteIcon = (vote: VoteType) => {
    switch (vote) {
      case "agree":
        return <Check className="w-3 h-3 text-white" />;
      case "disagree":
        return <X className="w-3 h-3 text-white" />;
      case "abstain":
        return <Minus className="w-3 h-3 text-white" />;
      case "no-vote":
        return <Ban className="w-3 h-3 text-white" />;
      case "absent":
        return <UserX className="w-3 h-3 text-white" />;
    }
  };

  const calculateSemicirclePosition = (index: number, total: number) => {
    const rows = 12; // จำนวนแถวทั้งหมด

    // คำนวณจำนวนที่นั่งในแต่ละแถว
    const seatsPerRowArray: number[] = [];
    let totalSeatsAllocated = 0;

    for (let i = 0; i < rows; i++) {
      const seatsInThisRow = 25 + i * 3;
      seatsPerRowArray.push(seatsInThisRow);
      totalSeatsAllocated += seatsInThisRow;
    }

    const diff = total - totalSeatsAllocated;
    seatsPerRowArray[rows - 1] += diff;

    // สร้าง array ของตำแหน่งทั้งหมด เรียงตามมุม (ซ้ายไปขวา) แล้วค่อยเรียงตามแถว (ในไปนอก)
    const positions: Array<{ angle: number; row: number; indexInRow: number }> = [];

    for (let row = 0; row < rows; row++) {
      const totalInRow = seatsPerRowArray[row];
      const startAngle = Math.PI;
      const endAngle = 0;
      const angleStep = (startAngle - endAngle) / (totalInRow > 1 ? totalInRow - 1 : 1);

      for (let seatInRow = 0; seatInRow < totalInRow; seatInRow++) {
        const angle = startAngle - angleStep * seatInRow;
        positions.push({ angle, row, indexInRow: seatInRow });
      }
    }

    // เรียงตามมุม (ซ้ายไปขวา) จากนั้นเรียงตามแถว (ในไปนอก)
    positions.sort((a, b) => {
      const angleDiff = b.angle - a.angle; // มุมมากไปน้อย (ซ้ายไปขวา)
      if (Math.abs(angleDiff) > 0.01) return angleDiff;
      return a.row - b.row; // แถวน้อยไปมาก (ในไปนอก)
    });

    const pos = positions[index];

    // คำนวณรัศมี
    const baseRadius = 20;
    const radiusIncrement = 2.3;
    const radius = baseRadius + pos.row * radiusIncrement;

    // คำนวณตำแหน่ง x, y
    const centerX = 50;
    const centerY = 50;

    const x = centerX + Math.cos(pos.angle) * radius;
    const y = centerY - Math.sin(pos.angle) * radius;

    return { x: `${x}%`, y: `${y}%`, row: pos.row };
  };

  const renderSeat = (mp: MP, index: number) => {
    const isFiltered = filteredMPs.some((m) => m.id === mp.id);
    const isHighlighted = highlightedMPId === mp.id || highlightedMPIds.includes(mp.id);
    const position =
      layout === "semicircle" ? calculateSemicirclePosition(index, sortedMPs.length) : { x: "0%", y: "0%", row: 0 };

    const partyColor = getPartyColor(mp.party);
    const partyColorValue = getPartyColorValue(mp.party);

    return (
      <TooltipProvider key={mp.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn("relative inline-block", layout === "semicircle" && "absolute")}
              style={layout === "semicircle" ? { left: position.x, top: position.y } : undefined}
            >
              {isHighlighted && (
                <div
                  className="absolute inset-0 rounded-full animate-pulse pointer-events-none"
                  style={{
                    width: "26px",
                    height: "26px",
                    marginLeft: "-5px",
                    marginTop: "-5px",
                    border: "3px solid hsl(var(--primary))",
                    boxShadow: "0 0 15px hsl(var(--primary) / 0.6)",
                  }}
                />
              )}
              <button
                onClick={() => onMPClick(mp)}
                onMouseEnter={() => setHoveredMP(mp.id)}
                onMouseLeave={() => setHoveredMP(null)}
                className={cn(
                  "w-[16px] h-[16px] rounded-full transition-all duration-300 flex items-center justify-center relative",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  layout === "grid" && partyColor,
                  (hoveredMP === mp.id || isHighlighted) && "scale-[1.8] ring-4 ring-primary z-20 shadow-lg",
                  !isFiltered && !isHighlighted && "opacity-20",
                )}
                style={layout === "semicircle" ? { backgroundColor: partyColorValue } : undefined}
              >
                {getVoteIcon(mp.vote)}
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{mp.name}</p>
              <p className="text-sm text-muted-foreground">{mp.party}</p>
              {/* <p className="text-sm text-muted-foreground">
                {mp.constituency} {mp.isProportional && "(Proportional)"}
              </p> */}
              <p className="text-sm font-medium capitalize mt-2">
                Vote:{" "}
                <span
                  className={cn(
                    mp.vote === "agree" && "text-success",
                    mp.vote === "disagree" && "text-destructive",
                    mp.vote === "abstain" && "text-abstain",
                  )}
                >
                  {mp.vote}
                </span>
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div
      className={cn(
        "w-full",
        layout === "grid"
          ? "grid gap-2 p-8 place-items-center"
          : "relative h-[750px] flex items-center justify-center p-2 max-w-[1000px] mx-auto",
      )}
      style={layout === "grid" ? { gridTemplateColumns: "repeat(25, minmax(0, 1fr))" } : undefined}
    >
      {sortedMPs.map((mp, index) => renderSeat(mp, index))}
    </div>
  );
};

export default ParliamentVisualization;