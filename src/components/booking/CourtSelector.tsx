import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { useQuery } from '@tanstack/react-query';
import { getAllCourts } from '@/services/courts';

export interface CourtSelectorProps {
  value?: number;
  onValueChange: (courtId: number) => void;
}

export const CourtSelector: React.FC<CourtSelectorProps> = ({
  value,
  onValueChange,
}) => {
  const [open, setOpen] = React.useState(false);

  const { data: courts = [], isLoading } = useQuery({
    queryKey: ['courts'],
    queryFn: getAllCourts,
  });

  const selectedCourt = courts.find((court) => court.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {selectedCourt
            ? selectedCourt.name
            : isLoading
              ? 'Cargando canchas...'
              : 'Seleccionar cancha...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar cancha..." />
          <CommandList>
            <CommandEmpty>No se encontraron canchas.</CommandEmpty>
            <CommandGroup>
              {courts.map((court) => (
                <CommandItem
                  key={court.id}
                  value={court.name}
                  onSelect={() => {
                    onValueChange(court.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === court.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {court.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
