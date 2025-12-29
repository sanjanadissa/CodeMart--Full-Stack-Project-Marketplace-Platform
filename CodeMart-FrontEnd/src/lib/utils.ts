import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { loadStripe } from "@stripe/stripe-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);