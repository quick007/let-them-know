import { User } from "@supabase/supabase-js";
import { Card, CardsResponse } from "../typings/cards";
import { ProfileResponse } from "../typings/profile";
import { supabase } from "./init";

/**
Gets the profile of the user
@returns Tne username and website of the user
*/

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

export async function getProfileByID(userID: number): Promise<ProfileResponse> {
  try {
    let { data, error, status } = await supabase
      .from("profiles")
      .select(`username, website`)
      .eq("id", userID)
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

