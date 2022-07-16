import { User } from "@supabase/supabase-js";
import { Card } from "../typings/cards";
import { supabase } from "./init";

export async function getProfile(user: User): Promise<{
  success: boolean;
  data?: { username: string; website: string };
  error?: string;
}> {
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

export async function getCards(user: User): Promise<{
  success: boolean;
  data?: { username: string; website: string };
  cards?: Card[];
  error?: string;
}> {
  try {
    let { data, error, status } = await supabase
      .from("profiles")
      .select(`username, website, cards`)
      .eq("id", user.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return {
        success: true,
        data: { username: data.username, website: data.website },
        cards: data.cards,
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false };
}

export async function newCard(user: User, card: Card): Promise<boolean> {
  try {
    const cards = await getCards(user);
    if (!cards.success) {
      return false;
    }

    const updates = {
      id: user.id,
			//@ts-expect-error
      cards: (cards.cards ? cards.cards[0].push(card) : [card]),
      updated_at: new Date(),
    };

    let { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    alert(error.message);
  }
}
