import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all approved restaurants
export const getRestaurants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("restaurants")
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();
  },
});

// Get restaurant by ID
export const getRestaurant = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.restaurantId);
  },
});

// Get products for a restaurant
export const getProducts = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .collect();
  },
});

// Seed restaurants with sample data
export const seedRestaurants = mutation({
  args: {},
  handler: async (ctx) => {
    const restaurants = [
      {
        name: "Burger King",
        description: "Os melhores hambúrgueres da cidade",
        image: "🍔",
        category: "Hambúrgueres",
        rating: 4.5,
        deliveryTime: "30-45 min",
        deliveryFee: 0,
        minimumOrder: 15.00,
        isOpen: true,
        paymentMethods: ["credit_card", "debit_card", "pix", "cash"],
        status: "approved",
      },
      {
        name: "Pizza Hut",
        description: "Pizzas deliciosas e quentinhas",
        image: "🍕",
        category: "Pizza",
        rating: 4.8,
        deliveryTime: "25-40 min",
        deliveryFee: 5.99,
        minimumOrder: 20.00,
        isOpen: true,
        paymentMethods: ["credit_card", "debit_card", "pix"],
        status: "approved",
      },
      {
        name: "Pizza Palace",
        description: "As melhores pizzas da cidade",
        image: "🍕",
        category: "Pizza",
        rating: 4.3,
        deliveryTime: "25-40 min",
        deliveryFee: 4.99,
        minimumOrder: 20.00,
        isOpen: true,
        paymentMethods: ["credit_card", "debit_card", "pix"],
        status: "approved",
      },
      {
        name: "Sushi Express",
        description: "Sushi fresco e autêntico",
        image: "🍣",
        category: "Japonesa",
        rating: 4.7,
        deliveryTime: "40-55 min",
        deliveryFee: 7.99,
        minimumOrder: 25.00,
        isOpen: true,
        paymentMethods: ["credit_card", "pix"],
        status: "approved",
      },
      {
        name: "Taco Bell",
        description: "Comida mexicana saborosa",
        image: "🌮",
        category: "Mexicana",
        rating: 4.2,
        deliveryTime: "20-35 min",
        deliveryFee: 3.99,
        minimumOrder: 12.00,
        isOpen: false,
        paymentMethods: ["credit_card", "debit_card", "cash"],
        status: "pending",
      },
      {
        name: "Açaí da Praia",
        description: "Açaí cremoso e delicioso",
        image: "🍇",
        category: "Doces",
        rating: 4.6,
        deliveryTime: "15-25 min",
        deliveryFee: 0,
        minimumOrder: 10.00,
        isOpen: true,
        paymentMethods: ["credit_card", "debit_card", "pix", "cash"],
        status: "approved",
      },
      {
        name: "Pasta & Cia",
        description: "Massas artesanais italianas",
        image: "🍝",
        category: "Italiana",
        rating: 4.4,
        deliveryTime: "35-50 min",
        deliveryFee: 6.99,
        minimumOrder: 25.00,
        isOpen: true,
        paymentMethods: ["credit_card", "debit_card", "pix"],
        status: "approved",
      },
    ];

    for (const restaurant of restaurants) {
      await ctx.db.insert("restaurants", restaurant);
    }
  },
});

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const restaurants = await ctx.db.query("restaurants").collect();
    
    for (const restaurant of restaurants) {
      if (restaurant.name === "Burger King") {
        const products = [
          {
            restaurantId: restaurant._id,
            name: "Big King",
            description: "Hambúrguer duplo com queijo, alface, cebola e molho especial",
            price: 18.90,
            image: "🍔",
            category: "Hambúrgueres",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Whopper",
            description: "O clássico hambúrguer do Burger King",
            price: 22.90,
            image: "🍔",
            category: "Hambúrgueres",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Batata Frita Grande",
            description: "Porção grande de batatas fritas crocantes",
            price: 8.90,
            image: "🍟",
            category: "Acompanhamentos",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Refrigerante 500ml",
            description: "Coca-Cola, Pepsi ou Guaraná",
            price: 5.90,
            image: "🥤",
            category: "Bebidas",
            available: true,
          },
        ];

        for (const product of products) {
          await ctx.db.insert("products", product);
        }
      }

      if (restaurant.name === "Pizza Hut") {
        const products = [
          {
            restaurantId: restaurant._id,
            name: "Pizza Margherita",
            description: "Molho de tomate, mussarela e manjericão",
            price: 32.90,
            image: "🍕",
            category: "Pizzas",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Pizza Pepperoni",
            description: "Molho de tomate, mussarela e pepperoni",
            price: 38.90,
            image: "🍕",
            category: "Pizzas",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Pizza Quatro Queijos",
            description: "Mussarela, parmesão, gorgonzola e provolone",
            price: 42.90,
            image: "🍕",
            category: "Pizzas",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Refrigerante 2L",
            description: "Coca-Cola, Pepsi ou Guaraná",
            price: 9.90,
            image: "🥤",
            category: "Bebidas",
            available: true,
          },
        ];

        for (const product of products) {
          await ctx.db.insert("products", product);
        }
      }

      if (restaurant.name === "Sushi Express") {
        const products = [
          {
            restaurantId: restaurant._id,
            name: "Combo Salmão",
            description: "10 peças de sushi e sashimi de salmão",
            price: 45.90,
            image: "🍣",
            category: "Combos",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Temaki Salmão",
            description: "Temaki de salmão com cream cheese",
            price: 15.90,
            image: "🍣",
            category: "Temakis",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Hot Roll",
            description: "8 peças de hot roll empanado",
            price: 28.90,
            image: "🍣",
            category: "Hot Rolls",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Yakisoba",
            description: "Macarrão oriental com legumes e molho especial",
            price: 22.90,
            image: "🍜",
            category: "Pratos Quentes",
            available: true,
          },
        ];

        for (const product of products) {
          await ctx.db.insert("products", product);
        }
      }

      if (restaurant.name === "Açaí da Praia") {
        const products = [
          {
            restaurantId: restaurant._id,
            name: "Açaí 300ml",
            description: "Açaí cremoso com granola, banana e mel",
            price: 12.90,
            image: "🍇",
            category: "Açaí",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Açaí 500ml",
            description: "Açaí cremoso com granola, banana, morango e leite condensado",
            price: 18.90,
            image: "🍇",
            category: "Açaí",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Vitamina de Açaí",
            description: "Vitamina cremosa de açaí com banana",
            price: 8.90,
            image: "🥤",
            category: "Bebidas",
            available: true,
          },
          {
            restaurantId: restaurant._id,
            name: "Tapioca Doce",
            description: "Tapioca com coco e leite condensado",
            price: 7.90,
            image: "🥞",
            category: "Tapiocas",
            available: true,
          },
        ];

        for (const product of products) {
          await ctx.db.insert("products", product);
        }
      }
    }
  },
});
