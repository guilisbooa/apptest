import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user's orders
export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get restaurant details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const restaurant = await ctx.db.get(order.restaurantId);
        return {
          ...order,
          restaurant,
        };
      })
    );

    return ordersWithDetails;
  },
});

// Create new order
export const createOrder = mutation({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    restaurantId: v.id("restaurants"),
    deliveryAddress: v.string(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Calculate total
    const subtotal = args.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.99; // Fixed delivery fee for now
    const total = subtotal + deliveryFee;

    // Create order
    const orderId = await ctx.db.insert("orders", {
      userId,
      restaurantId: args.restaurantId,
      items: args.items,
      total,
      deliveryFee,
      status: "pending",
      deliveryAddress: args.deliveryAddress,
      paymentMethod: args.paymentMethod,
    });

    return orderId;
  },
});

// Update order status (for admin)
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});
