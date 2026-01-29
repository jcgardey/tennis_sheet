import { type Person } from '@/services/persons';
import { Field, FieldLabel } from '../ui/field';
import { TSCombobox } from '../design-system/TSCombobox';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { usePersons } from '@/hooks/usePersons';
import { Text } from '../design-system/Text';

interface PlayerComboboxProps {
  value: Person[];
  onValueChange: (players: Person[]) => void;
}

export const PlayerCombobox: React.FC<PlayerComboboxProps> = ({
  onValueChange,
  value,
}) => {
  const { persons: players, isLoading } = usePersons('PLAYER');

  const handleValueChange = (selectedPlayer: Person | null) => {
    if (selectedPlayer) {
      onValueChange([...value, selectedPlayer]);
    }
  };

  return (
    <Field>
      <FieldLabel>Players</FieldLabel>
      <TSCombobox
        items={players.filter(
          (player) => !value.find((p) => p.id === player.id),
        )}
        value={null}
        onValueChange={handleValueChange}
        placeholder={isLoading ? 'Loading players...' : 'Select players'}
        itemToStringLabel={(player) => player.name}
        itemToStringValue={(player) => player.id.toString()}
        isItemEqualToValue={(player, anotherPlayer) =>
          player.id === anotherPlayer.id
        }
        emptyMessage="No players found."
      />
      {value.length > 0 && (
        <div className="flex flex-col gap-2">
          {value.map((player) => (
            <div
              key={player.id}
              className="px-3 py-1 text-sm flex items-center justify-between gap-2"
            >
              <Text variant="small" className="text-primary">
                {player.name}
              </Text>
              <Button
                variant="outline"
                size={'icon-sm'}
                onClick={() =>
                  onValueChange(value.filter((p) => p.id !== player.id))
                }
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Field>
  );
};
