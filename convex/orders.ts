import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrder = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    total: v.number(),
    deliveryFee: v.number(),
    deliveryAddress: v.string(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const orderId = await ctx.db.insert("orders", {
      userId,
      restaurantId: args.restaurantId,
      items: args.items,
      total: args.total,
      deliveryFee: args.deliveryFee,
      status: "pending",
      deliveryAddress: args.deliveryAddress,
      paymentMethod: args.paymentMethod,
    });

    // Clear cart after order
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return orderId;
  },
});

export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const ordersWithRestaurant = await Promise.all(
      orders.map(async (order) => {
        const restaurant = await ctx.db.get(order.restaurantId);
        return {
          ...order,
          restaurant,
        };
      })
    );

    return ordersWithRestaurant;
  },
});
