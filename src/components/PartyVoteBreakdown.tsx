import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MP } from "@/types/parliament";
import { useMemo } from "react";

interface PartyVoteBreakdownProps {
  mps: MP[];
}

const PartyVoteBreakdown = ({ mps }: PartyVoteBreakdownProps) => {
  const getPartyColor = (party: string) => {
    const partyKey = party.toLowerCase().replace(/\s+/g, "-");

    const partyColorValues: { [key: string]: string } = {
        "ประชาชน": "#ff6a00",
        "ใหม่": "#8b00ff",
        "เสรีรวมไทย": "#D8B720",
        "พลังสังคมใหม่": "#A91B35",
        "เป็นธรรม": "#0C4CA3",
        "ประชาธิปไตยใหม่": "#EF5E17",
        "ท้องที่ไทย": "#008C45",
        "ครูไทยเพื่อประชาชน": "#5c6bc0",
        "เพื่อไทรวมพลัง": "#5266AD",
        "ชาติพัฒนากล้า": "#F09D3B",
        "ไทยสร้างไทย": "#ff6699",
        "ประชาชาติ": "#9D7226",
        "ชาติไทยพัฒนา": "#CE3481",
        "ประชาธิปัตย์": "#54A1DC",
        "รวมไทยสร้างชาติ": "#020954",
        "พลังประชารัฐ": "#375CA5",
        "ภูมิใจไทย": "#2E3482",
        "เพื่อไทย": "#cc0000",
        "กล้าธรรม":"#50C770",
        "ชาติพัฒนา":"#228b22",
        "ไทยก้าวหน้า":"#7a5cff"
    };

    return partyColorValues[partyKey] || "hsla(240, 87%, 38%, 1.00)";
  };

  const partyStats = useMemo(() => {
    const stats = new Map<string, { agree: number; disagree: number; abstain: number; noVote: number; absent: number; total: number }>();

    mps.forEach((mp) => {
      if (!stats.has(mp.party)) {
        stats.set(mp.party, { agree: 0, disagree: 0, abstain: 0, noVote: 0, absent: 0, total: 0 });
      }
      const partyStat = stats.get(mp.party)!;
      partyStat.total++;
      if (mp.vote === "agree") partyStat.agree++;
      else if (mp.vote === "disagree") partyStat.disagree++;
      else if (mp.vote === "abstain") partyStat.abstain++;
      else if (mp.vote === "no-vote") partyStat.noVote++;
      else if (mp.vote === "absent") partyStat.absent++;
    });

    return Array.from(stats.entries())
      .map(([party, stat]) => ({ party, ...stat }))
      .sort((a, b) => b.total - a.total);
  }, [mps]);

  

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b flex-shrink-0">
        <h3 className="font-semibold text-lg">การโหวตแยกตามพรรค</h3>
        <p className="text-xs text-muted-foreground mt-1">รายละเอียดการโหวตของแต่ละพรรคการเมือง</p>
        
        {/* Legend - แสดงครั้งเดียวด้านบน */}
        <div className="flex gap-3 text-xs mt-3 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-success" />
            <span className="text-muted-foreground">เห็นด้วย</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-destructive border border-border" />
            <span className="text-muted-foreground">ไม่เห็นด้วย</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-abstain" />
            <span className="text-muted-foreground">งดออกเสียง</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-no-vote" />
            <span className="text-muted-foreground">ไม่ลงคะแนน</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-absent" />
            <span className="text-muted-foreground">ลา/ขาด</span>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {partyStats.map((stat) => (
            <div key={stat.party} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getPartyColor(stat.party) }} />
                  <span className="font-medium text-sm">{stat.party}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stat.total} ที่นั่ง</span>
              </div>

              {/* Stacked bar chart */}
              <div className="h-5 bg-muted rounded-sm overflow-hidden flex">
                {stat.agree > 0 && (
                  <div
                    className="bg-success transition-all duration-300 flex items-center justify-center relative group border border-border"
                    style={{ width: `${(stat.agree / stat.total) * 100}%` }}
                  >
                    {(stat.agree / stat.total) * 100 > 8 && (
                      <span className="text-xs font-medium text-success-foreground">{stat.agree}</span>
                    )}
                  </div>
                )}
                {stat.disagree > 0 && (
                  <div
                    className="bg-destructive transition-all duration-300 flex items-center justify-center relative group border border-border"
                    style={{ width: `${(stat.disagree / stat.total) * 100}%` }}
                  >
                    {(stat.disagree / stat.total) * 100 > 8 && (
                      <span className="text-xs font-medium text-destructive-foreground">{stat.disagree}</span>
                    )}
                  </div>
                )}
                {stat.abstain > 0 && (
                  <div
                    className="bg-abstain transition-all duration-300 flex items-center justify-center relative group border border-border"
                    style={{ width: `${(stat.abstain / stat.total) * 100}%` }}
                  >
                    {(stat.abstain / stat.total) * 100 > 8 && (
                      <span className="text-xs font-medium text-abstain-foreground">{stat.abstain}</span>
                    )}
                  </div>
                )}
                {stat.noVote > 0 && (
                  <div
                    className="bg-no-vote transition-all duration-300 flex items-center justify-center relative group border border-border"
                    style={{ width: `${(stat.noVote / stat.total) * 100}%` }}
                  >
                    {(stat.noVote / stat.total) * 100 > 8 && (
                      <span className="text-xs font-medium text-no-vote-foreground">{stat.noVote}</span>
                    )}
                  </div>
                )}
                {stat.absent > 0 && (
                  <div
                    className="bg-absent transition-all duration-300 flex items-center justify-center relative group border border-border"
                    style={{ width: `${(stat.absent / stat.total) * 100}%` }}
                  >
                    {(stat.absent / stat.total) * 100 > 8 && (
                      <span className="text-xs font-medium text-absent-foreground">{stat.absent}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default PartyVoteBreakdown;
