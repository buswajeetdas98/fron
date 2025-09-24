import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Euro,
  Search,
  Menu,
  User,
  ShoppingCart,
  Settings as SettingsIcon,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import InventoryGrid from "./InventoryGrid";
import TransactionPanel from "./TransactionPanel";
import SystemArchitecture from "./SystemArchitecture";
import UserProfile from "./UserProfile";
import Settings from "./Settings";

interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [spinForever, setSpinForever] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Route protection now handled by RequireAuth wrapper

  // Detect first-ever visit to enable continuous logo rotation
  useEffect(() => {
    try {
      const hasVisitedKey = "gm_has_visited";
      const hasVisited = typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem(hasVisitedKey)
        : null;
      if (!hasVisited) {
        setSpinForever(true);
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(hasVisitedKey, "1");
        }
      }
    } catch {
      // If localStorage is unavailable, fail gracefully without breaking UI
      setSpinForever(false);
    }
  }, []);

  // Sample inventory data
  const inventory: Medicine[] = [
    {
      id: 1,
      name: "Aspirin 500mg",
      price: 5.99,
      stock: 120,
      category: "Pain Relief",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80",
    },
    {
      id: 2,
      name: "Ibuprofen 400mg",
      price: 7.49,
      stock: 85,
      category: "Pain Relief",
      image:
        "https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&q=80",
    },
    {
      id: 3,
      name: "Paracetamol 500mg",
      price: 4.99,
      stock: 150,
      category: "Pain Relief",
      image:
        "https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&q=80",
    },
    {
      id: 4,
      name: "Amoxicillin 250mg",
      price: 12.99,
      stock: 45,
      category: "Antibiotics",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80",
    },
    {
      id: 5,
      name: "Cetirizine 10mg",
      price: 8.99,
      stock: 72,
      category: "Allergy",
      image:
        "https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&q=80",
    },
    {
      id: 6,
      name: "Omeprazole 20mg",
      price: 15.49,
      stock: 60,
      category: "Digestive",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80",
    },
    {
      id: 7,
      name: "Vitamin D3 1000IU",
      price: 9.99,
      stock: 95,
      category: "Supplements",
      image:
        "https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&q=80",
    },
    {
      id: 8,
      name: "Metformin 500mg",
      price: 11.99,
      stock: 55,
      category: "Diabetes",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80",
    },
  ];

  const addToCart = (medicine: Medicine) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === medicine.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { ...medicine, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const completeSale = () => {
    // In a real app, this would send a request to the backend
    // For demo purposes, we'll just clear the cart
    setCart([]);
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: spinForever ? Infinity : 0, ease: "linear" }}
              className="bg-primary rounded-full p-2"
            >
              <Euro className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-xl font-bold">Germany Meds</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setIsProfileOpen(true)}>
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <SettingsIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { localStorage.removeItem("gm_auth_token"); navigate("/login"); }}>Logout</Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Transaction Cart</SheetTitle>
          </SheetHeader>
          <TransactionPanel
            cartItems={cart.map((item) => ({
              id: item.id.toString(),
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              category: item.category,
            }))}
            onUpdateQuantity={(id, quantity) =>
              updateQuantity(parseInt(id), quantity)
            }
            onRemoveItem={(id) => removeFromCart(parseInt(id))}
            onCompleteSale={() => {
              completeSale();
              setIsCartOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Tabs
            defaultValue="dashboard"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-1 h-auto">
              <TabsTrigger value="dashboard" className="justify-start">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="inventory" className="justify-start">
                Inventory
              </TabsTrigger>
              <TabsTrigger
                value="architecture"
                className="justify-start"
                onClick={() => setShowArchitecture(true)}
              >
                Architecture
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="font-medium mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Items:</span>
                <span className="font-medium">{inventory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Low Stock:</span>
                <span className="font-medium text-amber-500">
                  {inventory.filter((item) => item.stock < 10).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cart Items:</span>
                <span className="font-medium">{cart.length}</span>
              </div>
            </div>
            <Separator className="my-3" />
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
              onClick={() => navigate("/inventory-management")}
            >
              <Package className="h-4 w-4" />
              Manage Inventory
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
          {/* Inventory Section */}
          <div className="flex-1 flex flex-col">
            <div className="mb-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "inventory"
                    ? "Inventory"
                    : "System Architecture"}
              </h2>
              {(activeTab === "dashboard" || activeTab === "inventory") && (
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicines..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>

            <Separator className="mb-4" />

            {(activeTab === "dashboard" || activeTab === "inventory") && (
              <div className="flex-1">
                <InventoryGrid
                  items={filteredInventory.map((item) => ({
                    id: item.id.toString(),
                    name: item.name,
                    price: item.price,
                    stock: item.stock,
                    category: item.category,
                    image: item.image,
                  }))}
                  onAddToCart={(item) =>
                    addToCart({
                      id: parseInt(item.id),
                      name: item.name,
                      price: item.price,
                      stock: item.stock,
                      category: item.category,
                      image: item.image,
                    })
                  }
                />
              </div>
            )}

            {activeTab === "architecture" && (
              <div className="flex-1 overflow-auto">
                <SystemArchitecture />
              </div>
            )}
          </div>

          {/* Transaction Panel moved to drawer; no fixed sidebar */}
        </div>
      </div>

      {/* User Profile Component */}
      <UserProfile open={isProfileOpen} onOpenChange={setIsProfileOpen} />

      {/* Settings Component */}
      <Settings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
};

export default Home;
