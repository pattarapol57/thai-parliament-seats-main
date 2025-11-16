import { MP } from "@/types/parliament";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X, Minus, Ban, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteBarChartProps {
  mps: MP[];
  orientation?: "horizontal" | "vertical";
  selectedVoteFilter?: string | null;
  onVoteClick?: (voteType: string | null) => void;
}

const VoteBarChart = ({ mps, orientation = "horizontal", selectedVoteFilter, onVoteClick }: VoteBarChartProps) => {
  const total = mps.length;
  const agreeCount = mps.filter((mp) => mp.vote === "agree").length;
  const disagreeCount = mps.filter((mp) => mp.vote === "disagree").length;
  const abstainCount = mps.filter((mp) => mp.vote === "abstain").length;
  const noVoteCount = mps.filter((mp) => mp.vote === "no-vote").length;
  const absentCount = mps.filter((mp) => mp.vote === "absent").length;

  const agreePercent = (agreeCount / total) * 100;
  const disagreePercent = (disagreeCount / total) * 100;
  const abstainPercent = (abstainCount / total) * 100;
  const noVotePercent = (noVoteCount / total) * 100;
  const absentPercent = (absentCount / total) * 100;

  const isHorizontal = orientation === "horizontal";

  const handleVoteClick = (voteType: string) => {
    if (onVoteClick) {
      // Toggle: if already selected, deselect it
      onVoteClick(selectedVoteFilter === voteType ? null : voteType);
    }
  };

  return (
    <Card className="h-full flex flex-col p-4">
      <h3 className="text-base font-semibold mb-3 flex-shrink-0">
        Vote Distribution
        {selectedVoteFilter && (
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (กรอง:{" "}
            {selectedVoteFilter === "agree"
              ? "เห็นด้วย"
              : selectedVoteFilter === "disagree"
                ? "ไม่เห็นด้วย"
                : selectedVoteFilter === "abstain"
                  ? "งดออกเสียง"
                  : selectedVoteFilter === "no-vote"
                    ? "ไม่ลงคะแนนเสียง"
                    : "ลา/ขาดลงมติ"}
            )
          </span>
        )}
      </h3>

      <div className={`flex ${isHorizontal ? "flex-row h-6" : "flex-col w-6"} rounded-lg overflow-hidden flex-shrink-0`}>
        {/* Agree Section */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "bg-success hover:opacity-80 transition-all cursor-pointer flex items-center justify-center border border-border",
                  selectedVoteFilter === "agree" && "ring-4 ring-primary",
                )}
                style={{
                  [isHorizontal ? "width" : "height"]: `${agreePercent}%`,
                }}
                onClick={() => handleVoteClick("agree")}
              >
                {agreePercent > 15 && (
                  <div className="flex items-center gap-2 text-success-foreground">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">{agreeCount}</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-success text-success-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="font-semibold">เห็นด้วย (Agree)</span>
                </div>
                <p className="text-sm">จำนวน: {agreeCount} คน</p>
                <p className="text-sm">สัดส่วน: {agreePercent.toFixed(1)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Disagree Section */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "bg-destructive hover:opacity-80 transition-all cursor-pointer flex items-center justify-center border border-border",
                  selectedVoteFilter === "disagree" && "ring-4 ring-primary",
                )}
                style={{
                  [isHorizontal ? "width" : "height"]: `${disagreePercent}%`,
                }}
                onClick={() => handleVoteClick("disagree")}
              >
                {disagreePercent > 15 && (
                  <div className="flex items-center gap-2 text-destructive-foreground">
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">{disagreeCount}</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span className="font-semibold">ไม่เห็นด้วย (Disagree)</span>
                </div>
                <p className="text-sm">จำนวน: {disagreeCount} คน</p>
                <p className="text-sm">สัดส่วน: {disagreePercent.toFixed(1)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Abstain Section */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "bg-abstain hover:opacity-80 transition-all cursor-pointer flex items-center justify-center border border-border",
                  selectedVoteFilter === "abstain" && "ring-4 ring-primary",
                )}
                style={{
                  [isHorizontal ? "width" : "height"]: `${abstainPercent}%`,
                }}
                onClick={() => handleVoteClick("abstain")}
              >
                {abstainPercent > 15 && (
                  <div className="flex items-center gap-2 text-abstain-foreground">
                    <Minus className="w-4 h-4" />
                    <span className="text-sm font-medium">{abstainCount}</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-abstain text-abstain-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4" />
                  <span className="font-semibold">งดออกเสียง (Abstain)</span>
                </div>
                <p className="text-sm">จำนวน: {abstainCount} คน</p>
                <p className="text-sm">สัดส่วน: {abstainPercent.toFixed(1)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* No Vote Section */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "bg-no-vote hover:opacity-80 transition-all cursor-pointer flex items-center justify-center border border-border",
                  selectedVoteFilter === "no-vote" && "ring-4 ring-primary",
                )}
                style={{
                  [isHorizontal ? "width" : "height"]: `${noVotePercent}%`,
                }}
                onClick={() => handleVoteClick("no-vote")}
              >
                {noVotePercent > 15 && (
                  <div className="flex items-center gap-2 text-no-vote-foreground">
                    <Ban className="w-4 h-4" />
                    <span className="text-sm font-medium">{noVoteCount}</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-no-vote text-no-vote-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  <span className="font-semibold">ไม่ลงคะแนนเสียง (No Vote)</span>
                </div>
                <p className="text-sm">จำนวน: {noVoteCount} คน</p>
                <p className="text-sm">สัดส่วน: {noVotePercent.toFixed(1)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Absent Section */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "bg-absent hover:opacity-80 transition-all cursor-pointer flex items-center justify-center border border-border",
                  selectedVoteFilter === "absent" && "ring-4 ring-primary",
                )}
                style={{
                  [isHorizontal ? "width" : "height"]: `${absentPercent}%`,
                }}
                onClick={() => handleVoteClick("absent")}
              >
                {absentPercent > 15 && (
                  <div className="flex items-center gap-2 text-absent-foreground">
                    <UserX className="w-4 h-4" />
                    <span className="text-sm font-medium">{absentCount}</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-absent text-absent-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <UserX className="w-4 h-4" />
                  <span className="font-semibold">ลา/ขาดลงมติ (Absent)</span>
                </div>
                <p className="text-sm">จำนวน: {absentCount} คน</p>
                <p className="text-sm">สัดส่วน: {absentPercent.toFixed(1)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-success" />
          <span>เห็นด้วย: {agreeCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
          <span>ไม่เห็นด้วย: {disagreeCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-abstain" />
          <span>งดออกเสียง: {abstainCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-no-vote" />
          <span>ไม่ลงคะแนน: {noVoteCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-absent" />
          <span>ลา/ขาด: {absentCount}</span>
        </div>
      </div>
    </Card>
  );
};

export default VoteBarChart;
