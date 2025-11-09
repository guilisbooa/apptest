import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // User profile extension
  userProfiles: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    birthDate: v.string(),
    cpf: v.string(),
    phone: v.string(),
  }).index("by_user", ["userId"]),

  // User addresses
  addresses: defineTable({
    userId: v.id("users"),
    street: v.string(),
    number: v.string(),
    complement: v.optional(v.string()),
    neighborhood: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    isDefault: v.boolean(),
    label: v.string(), // "Casa", "Trabalho", etc.
  }).index("by_user", ["userId"]),

  restaurants: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.string(),
    category: v.string(),
    rating: v.number(),
    deliveryTime: v.string(),
    deliveryFee: v.number(),
    minimumOrder: v.number(),
    isOpen: v.boolean(),
    paymentMethods: v.optional(v.array(v.string())),
    status: v.optional(v.string()), // "pending", "approved", "rejected"
    ownerId: v.optional(v.id("users")),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    cnpj: v.optional(v.string()),
  }).index("by_status", ["status"]),
  
  products: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    image: v.string(),
    category: v.string(),
    available: v.boolean(),
  }).index("by_restaurant", ["restaurantId"]),
  
  cartItems: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    restaurantId: v.id("restaurants"),
    quantity: v.number(),
    price: v.number(),
  }).index("by_user", ["userId"]),
  
  orders: defineTable({
    userId: v.id("users"),
    restaurantId: v.id("restaurants"),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    total: v.number(),
    deliveryFee: v.number(),
    status: v.string(), // "pending", "confirmed", "preparing", "delivering", "delivered", "cancelled"
    deliveryAddress: v.string(),
    paymentMethod: v.string(),
    adminNotes: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_restaurant", ["restaurantId"])
    .index("by_status", ["status"]),

  // Admin system
  admins: defineTable({
    username: v.string(),
    password: v.string(), // In production, this should be hashed
    name: v.string(),
    role: v.string(), // "super_admin", "admin", "moderator"
    isActive: v.boolean(),
  }).index("by_username", ["username"]),

  // Banner management
  banners: defineTable({
    title: v.string(),
    subtitle: v.string(),
    image: v.string(),
    color: v.string(),
    isActive: v.boolean(),
    order: v.number(),
  }).index("by_order", ["order"]),

  // Revenue tracking
  revenue: defineTable({
    orderId: v.id("orders"),
    restaurantId: v.id("restaurants"),
    amount: v.number(),
    platformFee: v.number(),
    restaurantAmount: v.number(),
    date: v.string(),
  }).index("by_restaurant", ["restaurantId"])
    .index("by_date", ["date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
