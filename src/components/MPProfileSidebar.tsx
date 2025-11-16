import { MP, MPHistory } from '@/types/parliament';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Check, X, Minus, MapPin, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MPProfileSidebarProps {
  mp: MP | null;
  history: MPHistory | null;
  open: boolean;
  onClose: () => void;
}

const MPProfileSidebar = ({ mp, history, open, onClose }: MPProfileSidebarProps) => {
  if (!mp || !history) return null;

  const getVoteIcon = (vote: string) => {
    switch (vote) {
      case 'agree':
        return <Check className="w-4 h-4 text-success" />;
      case 'disagree':
        return <X className="w-4 h-4 text-destructive" />;
      case 'abstain':
        return <Minus className="w-4 h-4 text-abstain" />;
    }
  };

  const getVoteBadgeVariant = (vote: string) => {
    switch (vote) {
      case 'agree':
        return 'default';
      case 'disagree':
        return 'destructive';
      case 'abstain':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div>
            <SheetTitle className="text-2xl">{mp.name}</SheetTitle>
            <SheetDescription className="text-base mt-2">
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="font-medium">
                  {mp.party}
                </Badge>
              </div>
            </SheetDescription>
          </div>

          {/* <div className="flex items-start gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{mp.constituency}</span>
            </div>
            {mp.isProportional && (
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Proportional</span>
              </div>
            )}
          </div> */}
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Voting Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">Agree</span>
                </div>
                <p className="text-2xl font-bold text-success">
                  {history.agreePercentage}%
                </p>
              </Card>
              <Card className="p-4 border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <X className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium">Disagree</span>
                </div>
                <p className="text-2xl font-bold text-destructive">
                  {history.disagreePercentage}%
                </p>
              </Card>
              <Card className="p-4 border-abstain/20">
                <div className="flex items-center gap-2 mb-2">
                  <Minus className="w-4 h-4 text-abstain" />
                  <span className="text-sm font-medium">Abstain</span>
                </div>
                <p className="text-2xl font-bold text-abstain">
                  {history.abstainPercentage}%
                </p>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Voting History</h3>
            <div className="space-y-3">
              {history.votes.slice(0, 10).map((vote, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{vote.billName}</p>
                      <p className="text-sm text-muted-foreground mt-1">{vote.date}</p>
                    </div>
                    <Badge variant={getVoteBadgeVariant(vote.vote)} className="shrink-0">
                      <span className="flex items-center gap-1">
                        {getVoteIcon(vote.vote)}
                        <span className="capitalize">{vote.vote}</span>
                      </span>
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MPProfileSidebar;
