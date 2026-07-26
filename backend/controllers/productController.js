const Product = require("../models/Product");

// @desc    Get all products with filtering and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 50 } = req.query;

    let query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = {};
    switch (sort) {
      case "low":
        sortOption = { price: 1 };
        break;
      case "high":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "discount":
        sortOption = { discount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
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

