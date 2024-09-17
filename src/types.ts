type EligibleItems = {
  shippable: boolean;
  items: Array<string>;
}
export type Settings = {
  amount: number;
  title: string;
  enabled: boolean;
  eligibleItems: EligibleItems;
};
