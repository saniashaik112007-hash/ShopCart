const Product = require("../models/Product");

// Fallback seed data for when database is not connected
const FALLBACK_PRODUCTS = [
  // Electronics
  { _id: "1", name: "Wireless Bluetooth Headphones", category: "Electronics", price: 2499, oldPrice: 4999, discount: 50, rating: 4.5, reviews: 2342, image: "🎧", description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal clear sound quality." },
  { _id: "2", name: "Smart Watch Pro Max", category: "Electronics", price: 3999, oldPrice: 7999, discount: 50, rating: 4.3, reviews: 1845, image: "⌚", description: "Advanced smartwatch with health monitoring, GPS tracking, waterproof design." },
  { _id: "3", name: "Bluetooth Speaker Boom", category: "Electronics", price: 1499, oldPrice: 2999, discount: 50, rating: 4.6, reviews: 3120, image: "🔊", description: "Portable Bluetooth speaker with powerful bass, 12-hour playtime." },
  { _id: "4", name: "USB-C Fast Charger 65W", category: "Electronics", price: 999, oldPrice: 1999, discount: 50, rating: 4.4, reviews: 5621, image: "🔌", description: "GaN fast charger with 65W power delivery." },
  // Fashion
  { _id: "5", name: "Classic Denim Jacket", category: "Fashion", price: 1899, oldPrice: 3799, discount: 50, rating: 4.2, reviews: 1560, image: "🧥", description: "Timeless denim jacket crafted from premium cotton." },
  { _id: "6", name: "Running Shoes Ultra", category: "Fashion", price: 2999, oldPrice: 5999, discount: 50, rating: 4.7, reviews: 4200, image: "👟", description: "Lightweight running shoes with responsive cushioning." },
  { _id: "7", name: "Casual Cotton T-Shirt", category: "Fashion", price: 599, oldPrice: 1199, discount: 50, rating: 4.1, reviews: 8900, image: "👕", description: "Soft 100% organic cotton t-shirt." },
  { _id: "8", name: "Leather Wallet Premium", category: "Fashion", price: 1299, oldPrice: 2599, discount: 50, rating: 4.5, reviews: 3450, image: "👛", description: "Handcrafted genuine leather wallet." },
  // Beauty
  { _id: "9", name: "Vitamin C Face Serum", category: "Beauty", price: 649, oldPrice: 1299, discount: 50, rating: 4.4, reviews: 6720, image: "🧴", description: "Brightening vitamin C serum with hyaluronic acid." },
  { _id: "10", name: "Professional Makeup Kit", category: "Beauty", price: 2499, oldPrice: 4999, discount: 50, rating: 4.3, reviews: 2890, image: "💄", description: "Complete 48-color makeup palette." },
  { _id: "11", name: "Organic Hair Oil", category: "Beauty", price: 449, oldPrice: 899, discount: 50, rating: 4.6, reviews: 12450, image: "🧴", description: "100% organic hair oil with coconut and argan." },
  // Home Appliances
  { _id: "12", name: "Smart LED Bulb WiFi", category: "Home Appliances", price: 799, oldPrice: 1599, discount: 50, rating: 4.3, reviews: 8900, image: "💡", description: "WiFi-enabled smart LED bulb with voice control." },
  { _id: "13", name: "Air Purifier HEPA", category: "Home Appliances", price: 6999, oldPrice: 13999, discount: 50, rating: 4.5, reviews: 2340, image: "🌀", description: "HEPA air purifier removes 99.97% of pollutants." },
  { _id: "14", name: "Electric Kettle 1.5L", category: "Home Appliances", price: 899, oldPrice: 1799, discount: 50, rating: 4.4, reviews: 15670, image: "🫖", description: "Stainless steel electric kettle with auto shut-off." },
  // Books
  { _id: "15", name: "JavaScript: The Good Parts", category: "Books", price: 499, oldPrice: 999, discount: 50, rating: 4.8, reviews: 4500, image: "📚", description: "Essential guide to JavaScript best practices." },
  { _id: "16", name: "Atomic Habits", category: "Books", price: 399, oldPrice: 799, discount: 50, rating: 4.9, reviews: 28900, image: "📖", description: "Build Good Habits & Break Bad Ones by James Clear." },
  { _id: "17", name: "The Alchemist", category: "Books", price: 299, oldPrice: 599, discount: 50, rating: 4.7, reviews: 34500, image: "📕", description: "Paulo Coelho's enchanting novel." },
  // Sports
  { _id: "18", name: "Yoga Mat Premium", category: "Sports", price: 999, oldPrice: 1999, discount: 50, rating: 4.5, reviews: 8900, image: "🧘", description: "Non-slip premium yoga mat." },
  { _id: "19", name: "Dumbbell Set 20kg", category: "Sports", price: 3499, oldPrice: 6999, discount: 50, rating: 4.3, reviews: 4500, image: "🏋️", description: "Adjustable dumbbell set with storage stand." },
  { _id: "20", name: "Smart Fitness Band", category: "Sports", price: 1999, oldPrice: 3999, discount: 50, rating: 4.4, reviews: 12300, image: "⌚", description: "Fitness tracker with heart rate monitor." }
];

// @desc    Get all products with filtering and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 50 } = req.query;

    // Use fallback products immediately (MongoDB connection unreliable)
    let filteredProducts = [...FALLBACK_PRODUCTS];

    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sort) {
      case "low": filteredProducts.sort((a, b) => a.price - b.price); break;
      case "high": filteredProducts.sort((a, b) => b.price - a.price); break;
      case "rating": filteredProducts.sort((a, b) => b.rating - a.rating); break;
      case "discount": filteredProducts.sort((a, b) => b.discount - a.discount); break;
      default: break;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(skip, skip + limitNum);

    res.json({
      products: paginatedProducts,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a product (admin/seed)
// @route   POST /api/products
// @access  Public (for seeding)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Seed products into database
// @route   POST /api/products/seed
// @access  Public
const seedProducts = async (req, res) => {
  try {
    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.json({ message: "Products already seeded", count });
    }

    const products = [
      // Electronics
      {
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 2499,
        oldPrice: 4999,
        discount: 50,
        rating: 4.5,
        reviews: 2342,
        image: "🎧",
        description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal clear sound quality. Features comfortable ear cushions and foldable design for easy portability."
      },
      {
        name: "Smart Watch Pro Max",
        category: "Electronics",
        price: 3999,
        oldPrice: 7999,
        discount: 50,
        rating: 4.3,
        reviews: 1845,
        image: "⌚",
        description: "Advanced smartwatch with health monitoring, GPS tracking, waterproof design, and 14-day battery life."
      },
      {
        name: "Bluetooth Speaker Boom",
        category: "Electronics",
        price: 1499,
        oldPrice: 2999,
        discount: 50,
        rating: 4.6,
        reviews: 3120,
        image: "🔊",
        description: "Portable Bluetooth speaker with powerful bass, 12-hour playtime, IPX7 waterproof rating."
      },
      {
        name: "USB-C Fast Charger 65W",
        category: "Electronics",
        price: 999,
        oldPrice: 1999,
        discount: 50,
        rating: 4.4,
        reviews: 5621,
        image: "🔌",
        description: "GaN fast charger with 65W power delivery, compatible with laptops, phones, and tablets."
      },
      // Fashion
      {
        name: "Classic Denim Jacket",
        category: "Fashion",
        price: 1899,
        oldPrice: 3799,
        discount: 50,
        rating: 4.2,
        reviews: 1560,
        image: "🧥",
        description: "Timeless denim jacket crafted from premium cotton. Features classic button closure and chest pockets."
      },
      {
        name: "Running Shoes Ultra",
        category: "Fashion",
        price: 2999,
        oldPrice: 5999,
        discount: 50,
        rating: 4.7,
        reviews: 4200,
        image: "👟",
        description: "Lightweight running shoes with responsive cushioning and breathable mesh upper."
      },
      {
        name: "Casual Cotton T-Shirt",
        category: "Fashion",
        price: 599,
        oldPrice: 1199,
        discount: 50,
        rating: 4.1,
        reviews: 8900,
        image: "👕",
        description: "Soft 100% organic cotton t-shirt with a relaxed fit. Available in multiple colors."
      },
      {
        name: "Leather Wallet Premium",
        category: "Fashion",
        price: 1299,
        oldPrice: 2599,
        discount: 50,
        rating: 4.5,
        reviews: 3450,
        image: "👛",
        description: "Handcrafted genuine leather wallet with multiple card slots and RFID blocking technology."
      },
      // Beauty
      {
        name: "Vitamin C Face Serum",
        category: "Beauty",
        price: 649,
        oldPrice: 1299,
        discount: 50,
        rating: 4.4,
        reviews: 6720,
        image: "🧴",
        description: "Brightening vitamin C serum with hyaluronic acid and vitamin E. Reduces dark spots and boosts glow."
      },
      {
        name: "Professional Makeup Kit",
        category: "Beauty",
        price: 2499,
        oldPrice: 4999,
        discount: 50,
        rating: 4.3,
        reviews: 2890,
        image: "💄",
        description: "Complete 48-color makeup palette with eyeshadows, blushes, lip colors, and brushes."
      },
      {
        name: "Organic Hair Oil",
        category: "Beauty",
        price: 449,
        oldPrice: 899,
        discount: 50,
        rating: 4.6,
        reviews: 12450,
        image: "🧴",
        description: "100% organic hair oil with coconut, almond, and argan oils. Promotes hair growth and adds shine."
      },
      // Home Appliances
      {
        name: "Smart LED Bulb WiFi",
        category: "Home Appliances",
        price: 799,
        oldPrice: 1599,
        discount: 50,
        rating: 4.3,
        reviews: 8900,
        image: "💡",
        description: "WiFi-enabled smart LED bulb with 16 million colors and voice control compatible with Alexa/Google."
      },
      {
        name: "Air Purifier HEPA",
        category: "Home Appliances",
        price: 6999,
        oldPrice: 13999,
        discount: 50,
        rating: 4.5,
        reviews: 2340,
        image: "🌀",
        description: "HEPA air purifier with activated carbon filter. Removes 99.97% of pollutants."
      },
      {
        name: "Electric Kettle 1.5L",
        category: "Home Appliances",
        price: 899,
        oldPrice: 1799,
        discount: 50,
        rating: 4.4,
        reviews: 15670,
        image: "🫖",
        description: "Stainless steel electric kettle with auto shut-off and rapid boil technology."
      },
      // Books
      {
        name: "JavaScript: The Good Parts",
        category: "Books",
        price: 499,
        oldPrice: 999,
        discount: 50,
        rating: 4.8,
        reviews: 4500,
        image: "📚",
        description: "Essential guide to JavaScript best practices by Douglas Crockford."
      },
      {
        name: "Atomic Habits",
        category: "Books",
        price: 399,
        oldPrice: 799,
        discount: 50,
        rating: 4.9,
        reviews: 28900,
        image: "📖",
        description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear."
      },
      {
        name: "The Alchemist",
        category: "Books",
        price: 299,
        oldPrice: 599,
        discount: 50,
        rating: 4.7,
        reviews: 34500,
        image: "📕",
        description: "Paulo Coelho's enchanting novel about following your dreams."
      },
      // Sports
      {
        name: "Yoga Mat Premium",
        category: "Sports",
        price: 999,
        oldPrice: 1999,
        discount: 50,
        rating: 4.5,
        reviews: 8900,
        image: "🧘",
        description: "Non-slip premium yoga mat with alignment lines. 6mm thickness for comfort."
      },
      {
        name: "Dumbbell Set 20kg",
        category: "Sports",
        price: 3499,
        oldPrice: 6999,
        discount: 50,
        rating: 4.3,
        reviews: 4500,
        image: "🏋️",
        description: "Adjustable dumbbell set with rubber grip handles and storage stand."
      },
      {
        name: "Smart Fitness Band",
        category: "Sports",
        price: 1999,
        oldPrice: 3999,
        discount: 50,
        rating: 4.4,
        reviews: 12300,
        image: "⌚",
        description: "Fitness tracker with heart rate monitor, step counter, sleep analysis, and notifications."
      }
    ];

    const created = await Product.insertMany(products);
    res.status(201).json({ message: "Products seeded successfully", count: created.length });
  } catch (error) {
    console.error("Seed products error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, seedProducts };

