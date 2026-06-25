import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import { createServer } from "http";

let orders = [];

let userProfiles = {
  "student-1": { name: "Aarav Sharma", walletBalance: 2000.0 },
  "student-2": { name: "Diya Patel", walletBalance: 500.0 },
};

const menuItems = [
  { id: "item-1", name: "Chicken biryani", description: "Rich and spicy chicken biryani.", price: 120.0, image: "🍗", category: "Mains" },
  { id: "item-2", name: "Egg fried rice", description: "Wok-tossed rice with egg and veggies.", price: 100.0, image: "🍳", category: "Fast Food" },
  { id: "item-3", name: "Cheese pizza", description: "Cheese and tomato sauce pizza.", price: 80.0, image: "🍕", category: "Fast Food" },
  { id: "item-4", name: "Choclates", description: "Assorted sweet chocolates.", price: 20.0, image: "🍫", category: "Snacks" },
  { id: "item-5", name: "Samosa", description: "Crispy pastry stuffed with spiced potatoes.", price: 20.0, image: "🥟", category: "Snacks" },
  { id: "item-6", name: "Chicken fried rice", description: "Wok-tossed rice with chicken chunks.", price: 110.0, image: "🍛", category: "Fast Food" },
  { id: "item-7", name: "Maggi", description: "Classic hot and spicy maggi noodles.", price: 50.0, image: "🍜", category: "Fast Food" },
  { id: "item-8", name: "Milkshake", description: "Chilled sweet milkshake.", price: 70.0, image: "🥤", category: "Drinks" },
  { id: "item-9", name: "Dosa", description: "Crispy crepe served with chutney.", price: 50.0, image: "🥞", category: "Tiffins" },
  { id: "item-10", name: "Idli", description: "Steamed rice cakes with chutney and sambar.", price: 40.0, image: "🍲", category: "Tiffins" },
  { id: "item-11", name: "Bonda", description: "Deep-fried savory snack.", price: 50.0, image: "🧆", category: "Tiffins" }
];

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  
  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const id = "student-" + name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!userProfiles[id]) {
      userProfiles[id] = { name, walletBalance: 0 };
    }
    res.json({ id, ...userProfiles[id] });
  });

  app.post("/api/recharge", (req, res) => {
    const { studentId, amount } = req.body;
    if (userProfiles[studentId]) {
      userProfiles[studentId].walletBalance += amount;
      io.emit(`wallet_updated_${studentId}`, userProfiles[studentId].walletBalance);
      res.json(userProfiles[studentId]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.get("/api/menu", (req, res) => {
    res.json(menuItems);
  });

  app.get("/api/user/:id", (req, res) => {
    const id = req.params.id;
    const user = userProfiles[id] || { name: "Unknown", walletBalance: 0 };
    res.json({ id, ...user });
  });

  app.get("/api/orders", (req, res) => {
    // Basic sorting: pending/preparing first, then high priority
    const sortedOrders = [...orders].sort((a, b) => {
      // Priority first
      if (a.priority === "high" && b.priority !== "high") return -1;
      if (a.priority !== "high" && b.priority === "high") return 1;
      // Then created time
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    res.json(sortedOrders);
  });

  app.get("/api/orders/:studentId", (req, res) => {
    const studentOrders = orders.filter(o => o.studentId === req.params.studentId);
    res.json(studentOrders);
  });

  app.post("/api/orders", (req, res) => {
    const { studentId, items, totalAmount } = req.body;
    
    // Simulate wallet deduction
    const userProfile = userProfiles[studentId];
    if (userProfile) {
      if (userProfile.walletBalance < totalAmount) {
        return res.status(400).json({ error: "Insufficient funds" });
      }
      userProfile.walletBalance -= totalAmount;
    }

    const newOrder = {
      id: "order-" + Date.now(),
      studentId: studentId,
      studentName: userProfile ? userProfile.name : "Guest",
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      priority: totalAmount > 10 ? "high" : "normal", // simple auto-priority logic
    };

    orders.push(newOrder);

    // Broadcast new order to chef and to specific student
    io.emit("order_updated", newOrder);
    
    // Also notify about wallet update
    if (userProfile) {
       io.emit(`wallet_updated_${studentId}`, userProfile.walletBalance);
    }

    res.json(newOrder);
  });

  app.put("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return res.status(404).json({ error: "Order not found" });

    orders[orderIndex].status = status;
    const updatedOrder = orders[orderIndex];

    io.emit("order_updated", updatedOrder);
    
    res.json(updatedOrder);
  });
  
  // WebSocket logic
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
