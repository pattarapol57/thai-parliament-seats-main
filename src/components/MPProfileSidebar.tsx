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
import { Check, X, Minus, UserX, Ban } from 'lucide-react';  // ✅ เพิ่ม UserX, Ban
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
      case 'เห็นด้วย':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'disagree':
      case 'ไม่เห็นด้วย':
        return <X className="w-4 h-4 text-red-600" />;
      case 'abstain':
      case 'งดออกเสียง':
        return <Minus className="w-4 h-4 text-yellow-600" />;
      case 'absent':
      case 'ลา/ขาด':
        return <UserX className="w-4 h-4 text-gray-600" />;  // ✅ เพิ่ม
      case 'no-vote':
      case 'ไม่ลงคะแนน':
        return <Ban className="w-4 h-4 text-gray-700" />;  // ✅ เพิ่ม
      default:
        return null;
    }
  };

  const getVoteBadgeVariant = (vote: string) => {
    switch (vote) {
      case 'agree':
      case 'เห็นด้วย':
        return 'default';
      case 'disagree':
      case 'ไม่เห็นด้วย':
        return 'destructive';
      case 'abstain':
      case 'งดออกเสียง':
        return 'secondary';
      case 'absent':
      case 'ลา/ขาด':
        return 'outline';  // ✅ เพิ่ม
      case 'no-vote':
      case 'ไม่ลงคะแนน':
        return 'outline';  // ✅ เพิ่ม
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
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">สถิติการลงมติ</h3>
            {/* ✅ เปลี่ยนเป็น grid-cols-2 md:grid-cols-5 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              {/* เห็นด้วย */}
              <Card className="p-4 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">เห็นด้วย</span>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {history.agreePercentage}%
                </p>
              </Card>

              {/* ไม่เห็นด้วย */}
              <Card className="p-4 border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium">ไม่เห็นด้วย</span>
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {history.disagreePercentage}%
                </p>
              </Card>

              {/* งดออกเสียง */}
              <Card className="p-4 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <Minus className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium">งดออกเสียง</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {history.abstainPercentage}%
                </p>
              </Card>

              {/* ✅ ลา/ขาด */}
              <Card className="p-4 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <UserX className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium">ลา/ขาด</span>
                </div>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {history.absentPercentage}%
                </p>
              </Card>

              {/* ✅ ไม่ลงคะแนน */}
              <Card className="p-4 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="w-4 h-4 text-gray-700 dark:text-gray-500" />
                  <span className="text-sm font-medium">ไม่ลงคะแนน</span>
                </div>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-500">
                  {history.noVotePercentage}%
                </p>
              </Card>

            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">ประวัติการลงมติล่าสุด</h3>
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