export interface Card {
  name: string;
  design: "wedding" | "birthday";
  id: number;
}

export interface CardsResponse {
  success: boolean;
  data?: { username: string; website: string, cardsID: number };
  cards?: Card[];
  error?: string;
}