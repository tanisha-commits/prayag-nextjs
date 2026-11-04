"use client";

import { useSyncExternalStore } from "react";

export interface UiState {
  categoryPanelOpen: boolean;
  mobileNavOpen: boolean;
}

const initialState: UiState = { categoryPanelOpen: false, mobileNavOpen: false };
let state = initialState;
const listeners = new Set<() => void>();

function setState(next: Partial<UiState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUi<T>(selector: (s: UiState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}

export const openCategoryPanel = () => setState({ categoryPanelOpen: true, mobileNavOpen: false });
export const closeCategoryPanel = () => setState({ categoryPanelOpen: false });
export const toggleMobileNav = () => setState({ mobileNavOpen: !state.mobileNavOpen });
export const closeMobileNav = () => setState({ mobileNavOpen: false });
