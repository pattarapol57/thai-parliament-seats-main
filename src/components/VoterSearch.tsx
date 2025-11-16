import { useState } from 'react';
import { MP } from '@/types/parliament';
import { Card } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';

interface VoterSearchProps {
  mps: MP[];
  selectedMPs: MP[];
  onMPsChange: (mps: MP[]) => void;
}

const searchSchema = z.object({
  query: z.string().trim().max(100, { message: "Search query too long" }),
});

const VoterSearch = ({ mps, selectedMPs, onMPsChange }: VoterSearchProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    try {
      searchSchema.parse({ query: value });
      setSearchValue(value);
    } catch (error) {
      // Invalid input, don't update
      console.error('Invalid search input');
    }
  };

  const toggleMP = (mp: MP) => {
    if (selectedMPs.some((m) => m.id === mp.id)) {
      onMPsChange(selectedMPs.filter((m) => m.id !== mp.id));
    } else {
      onMPsChange([...selectedMPs, mp]);
    }
  };

  const removeMP = (mpId: string) => {
    onMPsChange(selectedMPs.filter((m) => m.id !== mpId));
  };

  const handleClearAll = () => {
    onMPsChange([]);
    setSearchValue('');
  };

  const filteredMPs = mps.filter((mp) =>
    mp.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
    mp.party?.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium block">ค้นหา Voter</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-auto min-h-[40px]"
            >
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedMPs.length === 0 ? (
                  <span className="text-muted-foreground">พิมพ์ชื่อ voter...</span>
                ) : (
                  selectedMPs.map((mp) => (
                    <div
                      key={mp.id}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs"
                    >
                      <span className="truncate max-w-[150px]">{mp.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMP(mp.id);
                        }}
                        className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0 z-50" align="start">
            <Command shouldFilter={false}> 
              <CommandInput 
                placeholder="ค้นหาด้วยชื่อ, พรรค หรือเขต..." 
                value={searchValue}
                onValueChange={handleSearch}
              />
              <CommandList>
                <CommandEmpty>ไม่พบข้อมูล voter</CommandEmpty>
                <CommandGroup>
                  {filteredMPs.slice(0, 50).map((mp) => (
                    <CommandItem
                      key={mp.id}
                      value={mp.id}
                      onSelect={() => toggleMP(mp)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedMPs.some((m) => m.id === mp.id) ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{mp.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {mp.party} 
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            {selectedMPs.length > 0 && (
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="w-full"
                >
                  Clear all ({selectedMPs.length})
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
};

export default VoterSearch;
