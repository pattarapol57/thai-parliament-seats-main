import { MP, VotingSession } from '@/types/parliament';
import { Card } from '@/components/ui/card';
import { Check, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface VotingSummaryProps {
  mps: MP[];
  sessions: VotingSession[];
  currentSession: VotingSession;
  onSessionChange: (sessionId: string) => void;
  onPreviousSession: () => void;
  onNextSession: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const VotingSummary = ({ 
  mps, 
  sessions, 
  currentSession, 
  onSessionChange,
  onPreviousSession,
  onNextSession,
  canGoPrevious,
  canGoNext
}: VotingSummaryProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onPreviousSession}
              disabled={!canGoPrevious}
              className="shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentSession.billName}</h2>
              <p className="text-muted-foreground mt-1">{currentSession.date}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium">มตินี้ผลโหวตเป็น:</span>
                <span className={cn(
                  "text-sm font-bold px-3 py-1 rounded-full",
                  currentSession.result === 'passed' && "bg-success/20 text-success",
                  currentSession.result === 'failed' && "bg-destructive/20 text-destructive",
                  currentSession.result === 'pending' && "bg-warning/20 text-warning",
                  currentSession.result === 'withdrawn' && "bg-muted text-muted-foreground"
                )}>
                  {currentSession.result === 'passed' && 'ผ่าน'}
                  {currentSession.result === 'failed' && 'ไม่ผ่าน'}
                  {currentSession.result === 'pending' && 'รอพิจารณา'}
                  {currentSession.result === 'withdrawn' && 'ถอนมติ'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{currentSession.description}</p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={onNextSession}
              disabled={!canGoNext}
              className="shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-full">
            <label className="text-sm font-medium mb-2 block">ค้นหามติการโหวต</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between bg-background"
                >
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-medium truncate max-w-full">{currentSession.billName}</span>
                    <span className="text-xs text-muted-foreground">{currentSession.date}</span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-popover" align="start">
                <Command>
                  <CommandInput placeholder="ค้นหามติการโหวต..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>ไม่พบมติการโหวต</CommandEmpty>
                    <CommandGroup>
                      {sessions.map((session) => (
                        <CommandItem
                          key={session.id}
                          value={session.billName}
                          onSelect={() => {
                            onSessionChange(session.id);
                            setOpen(false);
                          }}
                        >
                          <div className="flex flex-col items-start w-full">
                            <span className="font-medium">{session.billName}</span>
                            <span className="text-xs text-muted-foreground">{session.date}</span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              currentSession.id === session.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VotingSummary;
