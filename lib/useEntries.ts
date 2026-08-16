"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot } from "./store";

export function useEntries() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
