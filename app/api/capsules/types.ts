// app/api/capsules/types.ts
export interface Capsule {
  id: number;
  title: string;
  date: string;
  receiver: string;
  email: string;
  sender: string;
  type: string;
  expiry: string;
  status: "Active" | "Expired";
}
