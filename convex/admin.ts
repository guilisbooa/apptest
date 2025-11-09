import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Admin authentication
export const loginAdmin = query({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!admin || admin.password !== args.password || !admin.isActive) {
      return null;
    }

    return {
      id: admin._id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    };
  },
});

// Seed admin accounts
export const seedAdmins = mutation({
  args: {},
  handler: async (ctx) => {
    const admins = [
      {
        username: "admin",
        password: "admin123",
        name: "Administrador Principal",
        role: "super_admin",
        isActive: true,
      },
      {
        username: "manager",
        password: "manager123",
        name: "Gerente de Operações",
        role: "admin",
        isActive: true,
      },
      {
        username: "support",
        password: "support123",
        name: "Suporte Técnico",
        role: "moderator",
        isActive: true,
      },
      {
        username: "finance",
        password: "finance123",
        name: "Financeiro",
        role: "admin",
        isActive: true,
      },
      {
        username: "marketing",
        password: "marketing123",
        name: "Marketing",
        role: "moderator",
        isActive: true,
      },
    ];

    for (const admin of admins) {
      const existing = await ctx.db
        .query("admins")
        .withIndex("by_username", (q) => q.eq("username", admin.username))
        .first();
      
      if (!existing) {
        await ctx.db.insert("admins", admin);
      }
    }
  },
});

// Dashboard stats
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const totalRestaurants = await ctx.db.query("restaurants").collect();
    const pendingRestaurants = totalRestaurants.filter(r => r.status === "pending");
    const approvedRestaurants = totalRestaurants.filter(r => r.status === "approved");
    
    const totalOrders = await ctx.db.query("orders").collect();
    const todayOrders = totalOrders.filter(order => {
      const orderDate = new Date(order._creationTime).toDateString();
      const today = new Date().toDateString();
      return orderDate === today;
    });
    
    const totalUsers = await ctx.db.query("users").collect();
    
    const totalRevenue = totalOrders.reduce((sum, order) => sum + order.total, 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      totalRestaurants: totalRestaurants.length,
      pendingRestaurants: pendingRestaurants.length,
      approvedRestaurants: approvedRestaurants.length,
      totalOrders: totalOrders.length,
      todayOrders: todayOrders.length,
      totalUsers: totalUsers.length,
      totalRevenue,
      todayRevenue,
    };
  },
});

// Restaurant management
export const getAllRestaurants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("restaurants").collect();
  },
});

export const updateRestaurantStatus = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    status: v.string(),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.restaurantId, {
      status: args.status,
    });
  },
});

export const updateRestaurant = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    deliveryTime: v.string(),
    deliveryFee: v.number(),
    minimumOrder: v.number(),
    isOpen: v.boolean(),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { restaurantId, ...updates } = args;
    return await ctx.db.patch(restaurantId, updates);
  },
});

export const deleteRestaurant = mutation({
  args: {
    restaurantId: v.id("restaurants"),
  },
  handler: async (ctx, args) => {
    // Delete all products first
    const products = await ctx.db
      .query("products")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .collect();
    
    for (const product of products) {
      await ctx.db.delete(product._id);
    }
    
    return await ctx.db.delete(args.restaurantId);
  },
});

// Order management
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const user = await ctx.db.get(order.userId);
        const restaurant = await ctx.db.get(order.restaurantId);
        return {
          ...order,
          user,
          restaurant,
        };
      })
    );
    
    return ordersWithDetails;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.orderId, {
      status: args.status,
      adminNotes: args.adminNotes,
    });
  },
});

// User management
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();
        return {
          ...user,
          profile,
        };
      })
    );
    return usersWithProfiles;
  },
});

// Banner management
export const getBanners = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("banners").withIndex("by_order", (q) => q.eq("order", 1)).collect();
  },
});

export const getActiveBanners = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("banners")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const createBanner = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    image: v.string(),
    color: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const banners = await ctx.db.query("banners").collect();
    const maxOrder = Math.max(...banners.map(b => b.order), 0);
    
    return await ctx.db.insert("banners", {
      ...args,
      order: maxOrder + 1,
    });
  },
});

export const updateBanner = mutation({
  args: {
    bannerId: v.id("banners"),
    title: v.string(),
    subtitle: v.string(),
    image: v.string(),
    color: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { bannerId, ...updates } = args;
    return await ctx.db.patch(bannerId, updates);
  },
});

export const deleteBanner = mutation({
  args: {
    bannerId: v.id("banners"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.bannerId);
  },
});

// Revenue reports
export const getRevenueReport = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").collect();
    
    let filteredOrders = orders;
    if (args.startDate && args.endDate) {
      const start = new Date(args.startDate).getTime();
      const end = new Date(args.endDate).getTime();
      filteredOrders = orders.filter(order => 
        order._creationTime >= start && order._creationTime <= end
      );
    }
    
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const platformFee = totalRevenue * 0.1; // 10% platform fee
    const restaurantRevenue = totalRevenue - platformFee;
    
    // Group by restaurant
    const revenueByRestaurant: Record<string, { name: string; revenue: number; orders: number }> = {};
    
    for (const order of filteredOrders) {
      const restaurant = await ctx.db.get(order.restaurantId);
      if (restaurant) {
        if (!revenueByRestaurant[restaurant._id]) {
          revenueByRestaurant[restaurant._id] = {
            name: restaurant.name,
            revenue: 0,
            orders: 0,
          };
        }
        revenueByRestaurant[restaurant._id].revenue += order.total;
        revenueByRestaurant[restaurant._id].orders += 1;
      }
    }
    
    return {
      totalRevenue,
      totalOrders,
      platformFee,
      restaurantRevenue,
      revenueByRestaurant: Object.values(revenueByRestaurant),
    };
  },
});

// Seed default banners
export const seedBanners = mutation({
  args: {},
  handler: async (ctx) => {
    const existingBanners = await ctx.db.query("banners").collect();
    if (existingBanners.length > 0) return;

    const banners = [
      {
        title: "Frete Grátis",
        subtitle: "Em pedidos acima de R$ 30",
        image: "🚚",
        color: "bg-gradient-to-r from-green-500 to-green-600",
        isActive: true,
        order: 1,
      },
      {
        title: "20% OFF",
        subtitle: "No seu primeiro pedido",
        image: "🎉",
        color: "bg-gradient-to-r from-red-500 to-red-600",
        isActive: true,
        order: 2,
      },
      {
        title: "Pizza em Dobro",
        subtitle: "Toda terça-feira",
        image: "🍕",
        color: "bg-gradient-to-r from-orange-500 to-orange-600",
        isActive: true,
        order: 3,
      },
    ];

    for (const banner of banners) {
      await ctx.db.insert("banners", banner);
    }
  },
});
