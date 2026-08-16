"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getProgressSnapshot, getServerProgressSnapshot } from "./store";

export function useProgress() {
  return useSyncExternalStore(subscribe, getProgressSnapshot, getServerProgressSnapshot);
}
