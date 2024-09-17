type EligibleItems = {
  shippable: boolean;
  items: Array<string>;
}
export type Settings = {
  amount: number;
  title: string;
  color: string;
  iconColor: string;
  enabled: true;
  eligibleItems: EligibleItems;
};
