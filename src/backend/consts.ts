import type { Settings } from "../types";

// Update according to your app's needed collections
export const SETTINGS_COLLECTION_ID = 'insurance-app-settings';
export const CHECKOUT_COLLECTION_ID = 'insurance-app-checkout';
export const DEFAULT_SETTING: Settings = {
  title: 'Make it carbon neutral',
  amount: 2,
  enabled: true,
  eligibleItems: {
    shippable: true,
    items: [],
  }
};
