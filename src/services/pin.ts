export function generatePin(): string {
  // Generates a 6-digit game PIN like 482 910
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
}

export function pinToPeerId(pin: string): string {
  const clean = pin.replace(/\s+/g, '');
  return `kahout-room-${clean}`;
}

export function formatPin(pin: string): string {
  const clean = pin.replace(/\D/g, '');
  if (clean.length > 3) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)}`;
  }
  return clean;
}
