const FAVORITES_KEY = 'guest_favorites';

function readGuestFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((value) => Number(value)).filter((value) => Number.isFinite(value));
  } catch {
    return [];
  }
}

function writeGuestFavorites(ids: number[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function getGuestFavoriteIds(): number[] {
  return readGuestFavorites();
}

export function isGuestFavorite(propertyId: number): boolean {
  return readGuestFavorites().includes(propertyId);
}

export function addGuestFavorite(propertyId: number): void {
  const ids = readGuestFavorites();
  if (!ids.includes(propertyId)) {
    ids.push(propertyId);
    writeGuestFavorites(ids);
  }
}

export function removeGuestFavorite(propertyId: number): void {
  const ids = readGuestFavorites().filter((id) => id !== propertyId);
  writeGuestFavorites(ids);
}

export function toggleGuestFavorite(propertyId: number): boolean {
  const ids = readGuestFavorites();
  if (ids.includes(propertyId)) {
    writeGuestFavorites(ids.filter((id) => id !== propertyId));
    return false;
  }
  ids.push(propertyId);
  writeGuestFavorites(ids);
  return true;
}
