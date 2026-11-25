const http = require('http');
const fs = require('fs');
const path = require('path');

let foods = [
    { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
    { id: 2, foodName: "Burger", category: "Fast Food", price: 150, availability: true },
    { id: 3, foodName: "Pasta", category: "Italian", price: 200, availability: false }
];

const server = http.createServer((req, res) => {
    const url = req.url;

    if (req.method === "GET" && url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Food Ordering Restaurant</h1>");
    }

    else if (req.method === "GET" && url === "/foods") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(foods.filter(food => food.availability === true)));
    }

    else if (req.method === "GET" && url === "/about") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>About Us</h1><p>We serve delicious food to our customers.</p>");
    }

    else if (req.method === "GET" && url === "/menu") {
        fs.readFile(path.join(__dirname, "public", "menu.html"), (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Unable to read menu file");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        });
    }

    else if (req.method === "POST" && url === "/add-food") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const food = JSON.parse(body);

                if (
                    food.id === undefined ||
                    !food.foodName ||
                    !food.category ||
                    typeof food.price !== "number" ||
                    typeof food.availability !== "boolean"
                ) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Missing or invalid food details" }));
                }

                foods.push(food);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Food added successfully", food }));
            } catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid JSON" }));
            }
        });
    }

    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 - Route Not Found");
    }
});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});