import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isLoggedIn(): boolean {
  try {
    return Boolean(localStorage.getItem("gm_auth_token"));
  } catch {
    return false;
  }
}