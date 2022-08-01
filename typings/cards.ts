export interface Card {
  name: string;
  design: "wedding" | "birthday";
  updated: Date | string;
  public: boolean;
  id: number;
}

export interface CardsResponse {
  success: boolean;
  data?: { username: string; website: string; cardsID: number };
  cards?: Card[];
  error?: string;
}

export interface CreateCardData {
  page1: {
    celebrating: string;
    theme: string;
  },
  page2: {
    for: string;
    messageID: number;
    message: string;
    signature: string;
    giftCard: boolean;

  }
}