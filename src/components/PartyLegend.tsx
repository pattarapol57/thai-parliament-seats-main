import { Card } from '@/components/ui/card';
import { MP } from '@/types/parliament';

interface PartyLegendProps {
  mps: MP[];
}

const PartyLegend = ({ mps }: PartyLegendProps) => {
  // Get unique parties and their counts
  const partyStats = mps.reduce((acc, mp) => {
    if (!acc[mp.party]) {
      acc[mp.party] = 0;
    }
    acc[mp.party]++;
    return acc;
  }, {} as { [key: string]: number });

  const getPartyColor = (party: string) => {
    const partyKey = party.toLowerCase().replace(/\s+/g, '-');
    
    const partyColors: { [key: string]: string } = {
      'pheu-thai-party': 'bg-[hsl(var(--party-pheu-thai))]',
      'move-forward-party': 'bg-[hsl(var(--party-move-forward))]',
      'united-thai-nation-party': 'bg-[hsl(var(--party-united-thai))]',
      'democrat-party': 'bg-[hsl(var(--party-democrat))]',
      'bhumjaithai-party': 'bg-[hsl(var(--party-bhumjaithai))]',
      'palang-pracharath-party': 'bg-[hsl(var(--party-palang-pracharath))]',
      'thai-sang-thai-party': 'bg-[hsl(var(--party-thai-sang-thai))]',
      'prachachat-party': 'bg-[hsl(var(--party-prachachat))]',
    };

    return partyColors[partyKey] || 'bg-muted';
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">สีประจำพรรค</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(partyStats)
          .sort((a, b) => b[1] - a[1])
          .map(([party, count]) => (
            <div key={party} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full shrink-0 ${getPartyColor(party)}`} />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" title={party}>
                  {party.replace(' Party', '')}
                </p>
                <p className="text-xs text-muted-foreground">{count} ที่นั่ง</p>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
};

export default PartyLegend;
