export const SLOT_HEIGHT = 48; // Altura en px (h-12 de Tailwind)

export const START_HOUR = 8;
export const END_HOUR = 22;
export const SLOT_DURATION_MINUTES = 30;

// Generar los slots dinámicamente para evitar errores manuales
export const TIME_SLOTS = Array.from({ length: (END_HOUR - START_HOUR) * 2 + 1 }, (_, i) => {
  const hours = Math.floor(i / 2) + START_HOUR;
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
});