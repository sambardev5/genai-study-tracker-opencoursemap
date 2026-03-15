import type { UserProfile } from "@/lib/types";

export function isAdmin(user?: Pick<UserProfile, "isAdmin" | "email"> | null) {
  return Boolean(user?.isAdmin);
}

export function canAccessUserResource(requestedUserId: string, currentUser?: Pick<UserProfile, "id"> | null) {
  return currentUser?.id === requestedUserId;
}
