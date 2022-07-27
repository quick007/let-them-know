import { User } from "@supabase/supabase-js";
import { CardsResponse, Card } from "../typings/cards";
import { supabase } from "./init";

/**
Similar to getProfile with more functionality
*/
export async function getCards(user: User): Promise<CardsResponse> {
  try {
    let { data, error, status } = await supabase
      .from("profiles")
      .select(`username, website, cards, cardsID`)
      .eq("id", user.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return {
        success: true,
        data: {
          username: data.username,
          website: data.website,
          cardsID: data.cardsID,
        },
        cards: data.cards,
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false };
}

/**
Creates a new card. You'll need to call getCard and pass some of it's info into this function
*/
export async function newCard(
  user: User,
  card: Card,
  data: { username: string; website: string; cardsID: number },
  cards: Card[]
): Promise<boolean> {
  try {
    console.log(cards, "cardds");
    if (cards) {
      cards.push(card);
    }
    const updates = {
      id: user.id,
      cards: cards ? cards : [card],
      updated_at: new Date(),
      cardsID: data.cardsID + 1,
    };

    let { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal",
    });

    if (error) {
      throw error;
      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
Similar to getProfile with more functionality
*/
export async function getCardsByID(userID: string): Promise<CardsResponse> {
  try {
    let { data, error, status } = await supabase
      .from("profiles")
      .select(`username, website, cards, cardsID`)
      .eq("id", userID)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return {
        success: true,
        data: {
          username: data.username,
          website: data.website,
          cardsID: data.cardsID,
        },
        cards: data.cards,
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false };
}
