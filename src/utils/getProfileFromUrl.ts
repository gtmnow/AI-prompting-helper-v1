import { ProfileId } from '../config/profiles';

const validProfiles = new Set<ProfileId>(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

export function getProfileFromUrl(search: string = window.location.search): ProfileId | null {
  const params = new URLSearchParams(search);
  const value = params.get('profile');

  if (!value) {
    return null;
  }

  return validProfiles.has(value as ProfileId) ? (value as ProfileId) : null;
}
