import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createProfile = mutation({
  args: {
    fullName: v.string(),
    birthDate: v.string(),
    cpf: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      throw new Error("Profile already exists");
    }

    return await ctx.db.insert("userProfiles", {
      userId,
      fullName: args.fullName,
      birthDate: args.birthDate,
      cpf: args.cpf,
      phone: args.phone,
    });
  },
});

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return {
      user,
      profile,
    };
  },
});
