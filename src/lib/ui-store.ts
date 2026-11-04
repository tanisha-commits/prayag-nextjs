"use client";

import { useSyncExternalStore } from "react";

/**
 * Site-wide UI state shared between the header (which opens things) and overlays rendered elsewhere
 * in the tree (which close themselves). A tiny external store instead of Redux, so pages that only
 * need these two flags do not ship Redux Toolkit, React-Redux and Immer.
 */
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
