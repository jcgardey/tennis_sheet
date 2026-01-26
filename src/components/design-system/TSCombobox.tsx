import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../ui/combobox';

interface TSComboboxProps<T> {
  items: T[];
  value?: T | null;
  onValueChange: (value: T | null) => void;
  placeholder?: string;
  itemToStringLabel?: (item: T) => string;
  itemToStringValue?: (item: T) => string;
  isItemEqualToValue?: (item: T, value: T) => boolean;
  emptyMessage?: string;
}

export const TSCombobox = <T,>({
  items,
  value,
  onValueChange,
  placeholder = 'Select an option',
  itemToStringLabel,
  itemToStringValue,
  isItemEqualToValue,
  emptyMessage = 'No items found.',
}: TSComboboxProps<T>) => {
  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={onValueChange}
      itemToStringLabel={itemToStringLabel}
      isItemEqualToValue={isItemEqualToValue}
    >
      <ComboboxInput placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList className="pointer-events-auto">
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
