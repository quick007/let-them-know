import { User } from "@supabase/supabase-js";
import { Card, CardsResponse } from "../typings/cards";
import { ProfileResponse } from "../typings/profile";
import { supabase } from "./init";

export async function getProfile(user: User): Promise<ProfileResponse> {
  try {
    let { data, error, status } = await supabase
      .from("profiles")
      .select(`username, website`)
      .eq("id", user.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return {
        success: true,
        data: { username: data.username, website: data.website },
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false };
}

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
        data: { username: data.username, website: data.website, cardsID: data.cardsID },
        cards: data.cards,
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false };
}

export async function newCard(user: User, card: Card, data: { username: string; website: string, cardsID: number },
  cards: Card[]): Promise<boolean> {
  try {
    console.log(cards, "cardds")
    if (cards) {
      cards.push(card)
    }
    const updates = {
      id: user.id,
      cards: (cards ? cards : [card]),
      updated_at: new Date(),
      cardsID: data.cardsID + 1
    };

    let { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal",
    });

    if (error) {
      throw error;
      return false
    }
  } catch (error) {
    alert(error.message);
    return false
  }
}
