import { useState } from 'react';
import { VoteType, LayoutType } from '@/types/parliament';
import { Button } from '@/components/ui/button';
import { Grid3x3, CircleDot, Check, ChevronsUpDown, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FilterControlsProps {
  parties: string[];
  selectedParties: string[];
  selectedVotes: VoteType[];
  layout: LayoutType;
  onPartiesChange: (parties: string[]) => void;
  onVotesChange: (votes: VoteType[]) => void;
  onLayoutChange: (layout: LayoutType) => void;
}

const FilterControls = ({
  parties,
  selectedParties,
  selectedVotes,
  layout,
  onPartiesChange,
  onVotesChange,
  onLayoutChange,
}: FilterControlsProps) => {
  const [partyOpen, setPartyOpen] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);

  const voteOptions: { value: VoteType; label: string }[] = [
    { value: 'agree', label: 'เห็นด้วย' },
    { value: 'disagree', label: 'ไม่เห็นด้วย' },
    { value: 'abstain', label: 'งดออกเสียง' },
    { value: 'absent', label: 'ลา/ขาด' },
    { value: 'no-vote', label:'ไม่ลงคะแนน' },
  ];

  const toggleParty = (party: string) => {
    if (selectedParties.includes(party)) {
      onPartiesChange(selectedParties.filter((p) => p !== party));
    } else {
      onPartiesChange([...selectedParties, party]);
    }
  };

  const toggleVote = (vote: VoteType) => {
    if (selectedVotes.includes(vote)) {
      onVotesChange(selectedVotes.filter((v) => v !== vote));
    } else {
      onVotesChange([...selectedVotes, vote]);
    }
  };

  const clearParties = () => onPartiesChange([]);
  const clearVotes = () => onVotesChange([]);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[250px]">
          <label className="text-sm font-medium mb-2 block">พรรคการเมือง</label>
          <Popover open={partyOpen} onOpenChange={setPartyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={partyOpen}
                className="w-full justify-between h-auto min-h-[40px]"
              >
                <div className="flex flex-wrap gap-1 flex-1">
                  {selectedParties.length === 0 ? (
                    <span className="text-muted-foreground">เลือกพรรคการเมือง...</span>
                  ) : (
                    selectedParties.map((party) => (
                      <Badge key={party} variant="secondary" className="text-xs">
                        {party}
                      </Badge>
                    ))
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 z-50" align="start">
              <Command>
                <CommandInput placeholder="Search parties..." />
                <CommandList>
                  <CommandEmpty>ไม่พบพรรคการเมือง.</CommandEmpty>
                  <CommandGroup>
                    {parties.map((party) => (
                      <CommandItem
                        key={party}
                        value={party}
                        onSelect={() => toggleParty(party)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedParties.includes(party) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {party}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              {selectedParties.length > 0 && (
                <div className="p-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearParties}
                    className="w-full"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 min-w-[250px]">
          <label className="text-sm font-medium mb-2 block">การลงมติ</label>
          <Popover open={voteOpen} onOpenChange={setVoteOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={voteOpen}
                className="w-full justify-between h-auto min-h-[40px]"
              >
                <div className="flex flex-wrap gap-1 flex-1">
                  {selectedVotes.length === 0 ? (
                    <span className="text-muted-foreground">เลือกการลงมติ...</span>
                  ) : (
                    selectedVotes.map((vote) => (
                      <Badge key={vote} variant="secondary" className="text-xs capitalize">
                        {vote}
                      </Badge>
                    ))
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0 z-50" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {voteOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => toggleVote(option.value)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedVotes.includes(option.value) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              {selectedVotes.length > 0 && (
                <div className="p-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearVotes}
                    className="w-full"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">รูปแบบการแสดงผล</label>
          <div className="flex gap-2">
            <Button
              variant={layout === 'semicircle' ? 'default' : 'outline'}
              size="icon"
              onClick={() => onLayoutChange('semicircle')}
              title="แสดงแบบครึ่งวงกลม"
            >
              <CircleDot className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => onLayoutChange('grid')}
              title="แสดงแบบตาราง"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FilterControls;
