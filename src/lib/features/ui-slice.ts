import { createSlice } from "@reduxjs/toolkit";

/**
 * Site-wide UI state shared between the header (which opens things) and
 * overlays rendered elsewhere in the tree (which close themselves).
 */
export interface UiState {
  categoryPanelOpen: boolean;
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  categoryPanelOpen: false,
  mobileNavOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCategoryPanel(state) {
      state.categoryPanelOpen = true;
      state.mobileNavOpen = false;
    },
    closeCategoryPanel(state) {
      state.categoryPanelOpen = false;
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    closeMobileNav(state) {
      state.mobileNavOpen = false;
    },
  },
});

export const {
  openCategoryPanel,
  closeCategoryPanel,
  toggleMobileNav,
  closeMobileNav,
} = uiSlice.actions;
