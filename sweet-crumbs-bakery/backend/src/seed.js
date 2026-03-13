require("dotenv").config();

const { connectDb } = require("./utils/db");
const { ensureOwnerUser } = require("./utils/seedOwner");
const Product = require("./models/Product");
const { slugify } = require("./utils/slug");

const initial = [
  {
    name: "Chocolate Cake",
    description: "Rich, moist chocolate sponge with smooth chocolate frosting.",
    price: 450,
    flavor: "chocolate",
    category: "Cake",
    weightOptions: ["0.5kg", "1kg", "2kg"],
    isFeatured: true,
    isPopular: true,
  },
  {
    name: "Red Velvet Cake",
    description: "Classic red velvet with cream cheese frosting.",
    price: 550,
    flavor: "red velvet",
    category: "Cake",
    weightOptions: ["0.5kg", "1kg", "2kg"],
    isFeatured: true,
    isPopular: true,
  },
  {
    name: "Blueberry Muffin",
    description: "Soft muffin with juicy blueberries.",
    price: 120,
    flavor: "fruity",
    category: "Muffin",
    weightOptions: ["1 pc", "6 pcs"],
    isPopular: true,
  },
  {
    name: "Croissant",
    description: "Buttery, flaky French-style croissant.",
    price: 90,
    flavor: "buttery",
    category: "Pastry",
    weightOptions: ["1 pc", "6 pcs"],
    isPopular: true,
  },
  {
    name: "Cupcakes (Box of 6)",
    description: "Assorted cupcakes with creamy frosting.",
    price: 350,
    flavor: "assorted",
    category: "Cupcake",
    weightOptions: ["6 pcs", "12 pcs"],
    isFeatured: true,
  },
  {
    name: "Donuts",
    description: "Soft donuts with classic glaze.",
    price: 80,
    flavor: "classic",
    category: "Donut",
    weightOptions: ["1 pc", "6 pcs", "12 pcs"],
    isPopular: true,
  },
  // Menu highlights from PDF (no prices provided → set reasonable defaults)
  { name: "Chococlate Truffle Cake", description: "Everyone's favorite truffle cake.", price: 700, flavor: "chocolate", category: "Cake", isPopular: true },
  { name: "Black Forest Cake", description: "Chocolate sponge with cherries and cream.", price: 650, flavor: "chocolate", category: "Cake", isPopular: true },
  { name: "Pineapple Cake", description: "Light pineapple cake with fresh flavor.", price: 600, flavor: "fruity", category: "Cake", isPopular: true },
  { name: "Rich Chocolate Devil Cake", description: "Deep chocolate tea cake style.", price: 480, flavor: "chocolate", category: "Tea Cake" },
  { name: "Fudgy Crinkle Brownie", description: "Dense, fudgy brownie with crackly top.", price: 160, flavor: "chocolate", category: "Brownie" },
  { name: "Nutella Brownie", description: "Chocolate brownie with Nutella.", price: 190, flavor: "chocolate", category: "Brownie" },
  { name: "Double Chocolate Cookies", description: "Double chocolate, bakery-style cookies.", price: 90, flavor: "chocolate", category: "Cookies" },
  { name: "Perfect Sugar Donuts", description: "Classic sugar-coated donuts.", price: 90, flavor: "classic", category: "Donut" },
  { name: "Lotus Biscoff Donuts", description: "Donuts topped with Lotus Biscoff.", price: 120, flavor: "caramel", category: "Donut" },
  { name: "Baked New York Cheese Cake", description: "Classic baked New York cheesecake.", price: 220, flavor: "vanilla", category: "Cheesecake", isFeatured: true },
];

async function run() {
  await connectDb(process.env.MONGODB_URI);
  await ensureOwnerUser();

  for (const p of initial) {
    const slug = slugify(p.name);
    // Upsert by slug so re-running seed is safe
    await Product.findOneAndUpdate(
      { slug },
      { ...p, slug, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${initial.length} products.`);
  process.exit(0);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

