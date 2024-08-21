const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://robinkhan1122111:lFTFbkClfVf69L6i@cluster0.hz7wr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define the product schema
const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Allows any type
    required: false,
  },
});

// Create the product model
const Product = mongoose.model("Product", productSchema);

// Get all products
app.get("/api/products/getAll", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new product
app.post("/api/products", async (req, res) => {
  const { name, data } = req.body;

  let parsedData = data;

  // Attempt to parse the data if it's a string
  if (typeof data === "string") {
    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      // If parsing fails, keep the data as-is (it may not be JSON)
      parsedData = data;
    }
  }

  const newProduct = new Product({
    id: uuidv4(), // Generate a unique ID
    name,
    data: parsedData, // Store the parsed or original data
  });

  try {
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
