import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import type { ComboboxRootProps } from '@base-ui/react';

interface TSComboboxProps<T> extends ComboboxRootProps<T> {
  onValueChange: (value: T | null) => void;
  placeholder?: string;
}

export const TSCombobox = <T,>({
  items,
  value,
  onValueChange,
  itemToStringLabel,
  itemToStringValue,
  placeholder = 'Select an option',
  isItemEqualToValue,
}: TSComboboxProps<T>) => {
  return (
    <Combobox
      items={items}
      onValueChange={onValueChange}
      value={value}
      itemToStringLabel={itemToStringLabel}
      isItemEqualToValue={isItemEqualToValue}
    >
      <ComboboxInput placeholder={placeholder} />
      <ComboboxContent className="pointer-events-auto">
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem
              key={itemToStringValue ? itemToStringValue(item) : String(item)}
              value={item}
            >
              {itemToStringLabel ? itemToStringLabel(item) : String(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
