import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user's addresses
export const getUserAddresses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Add new address
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
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // If this is set as default, unset other default addresses
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
      ...args,
    });
  },
});

// Update address
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
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const address = await ctx.db.get(args.addressId);
    if (!address || address.userId !== userId) {
      throw new Error("Address not found or unauthorized");
    }

    // If this is set as default, unset other default addresses
    if (args.isDefault) {
      const existingAddresses = await ctx.db
        .query("addresses")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      for (const addr of existingAddresses) {
        if (addr.isDefault && addr._id !== args.addressId) {
          await ctx.db.patch(addr._id, { isDefault: false });
        }
      }
    }

    const { addressId, ...updates } = args;
    await ctx.db.patch(addressId, updates);
  },
});

// Delete address
export const deleteAddress = mutation({
  args: {
    addressId: v.id("addresses"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const address = await ctx.db.get(args.addressId);
    if (!address || address.userId !== userId) {
      throw new Error("Address not found or unauthorized");
    }

    await ctx.db.delete(args.addressId);
  },
});
