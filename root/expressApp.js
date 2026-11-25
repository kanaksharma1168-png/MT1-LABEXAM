const express = require('express');
const app = express();

app.use(express.json());

let foods = [
    { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
    { id: 2, foodName: "Burger", category: "Fast Food", price: 150, availability: true },
    { id: 3, foodName: "Pasta", category: "Italian", price: 200, availability: false }
];

// GET all foods
app.get('/foods', (req, res) => {
    res.json(foods);
});

// GET food by ID
app.get('/foods/:id', (req, res) => {
    const food = foods.find(f => f.id === Number(req.params.id));

    if (!food) {
        return res.status(404).json({ message: "Food not found" });
    }

    res.json(food);
});

// POST add new food
app.post('/foods', (req, res) => {
    const { id, foodName, category, price, availability } = req.body;

    if (
        id === undefined ||
        !foodName ||
        !category ||
        typeof price !== "number" ||
        price <= 0 ||
        typeof availability !== "boolean"
    ) {
        return res.status(400).json({ message: "Invalid or missing food details" });
    }

    const food = { id, foodName, category, price, availability };
    foods.push(food);

    res.status(201).json({
        message: "Food item added successfully",
        food
    });
});

// PUT update food
app.put('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const food = foods.find(f => f.id === id);

    if (!food) {
        return res.status(404).json({ message: "Food not found" });
    }

    const { foodName, category, price, availability } = req.body;

    if (
        !foodName ||
        !category ||
        typeof price !== "number" ||
        price <= 0 ||
        typeof availability !== "boolean"
    ) {
        return res.status(400).json({ message: "Invalid or missing food details" });
    }

    food.foodName = foodName;
    food.category = category;
    food.price = price;
    food.availability = availability;

    res.json({
        message: "Food item updated successfully",
        food
    });
});

// DELETE food
app.delete('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = foods.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Food not found" });
    }

    const deletedFood = foods.splice(index, 1);

    res.json({
        message: "Food item deleted successfully",
        food: deletedFood[0]
    });
});

// Invalid route
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Invalid JSON handling
app.use((err, req, res, next) => {
    res.status(400).json({ message: "Invalid JSON format" });
});

app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});