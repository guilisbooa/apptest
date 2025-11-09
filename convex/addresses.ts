import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserAddresses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const addAddress = mutation({
  args: {
    street: v.string(),
    number: v.string(),
    complement: v.optional(v.string()),
    neighborhood: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    label: v.string(),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    // If this is set as default, unset other defaults
    if (args.isDefault) {
      const existingAddresses = await ctx.db
        .query("addresses")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      for (const address of existingAddresses) {
        if (address.isDefault) {
          await ctx.db.patch(address._id, { isDefault: false });
        }
      }
    }

    return await ctx.db.insert("addresses", {
      userId,
      street: args.street,
      number: args.number,
      complement: args.complement,
      neighborhood: args.neighborhood,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      label: args.label,
      isDefault: args.isDefault,
    });
  },
});

export const updateAddress = mutation({
  args: {
    addressId: v.id("addresses"),
    street: v.string(),
    number: v.string(),
    complement: v.optional(v.string()),
    neighborhood: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    label: v.string(),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    // If this is set as default, unset other defaults
    if (args.isDefault) {
      const existingAddresses = await ctx.db
        .query("addresses")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      for (const address of existingAddresses) {
        if (address.isDefault && address._id !== args.addressId) {
          await ctx.db.patch(address._id, { isDefault: false });
        }
      }
    }

    return await ctx.db.patch(args.addressId, {
      street: args.street,
      number: args.number,
      complement: args.complement,
      neighborhood: args.neighborhood,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      label: args.label,
      isDefault: args.isDefault,
    });
  },
});

export const deleteAddress = mutation({
  args: {
    addressId: v.id("addresses"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    return await ctx.db.delete(args.addressId);
  },
});

export const setDefaultAddress = mutation({
  args: {
    addressId: v.id("addresses"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    // Unset all defaults first
    const existingAddresses = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const address of existingAddresses) {
      if (address.isDefault) {
        await ctx.db.patch(address._id, { isDefault: false });
      }
    }

    // Set the new default
    return await ctx.db.patch(args.addressId, { isDefault: true });
  },
});
