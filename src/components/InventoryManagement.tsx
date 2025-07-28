import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Save,
  X,
  Upload,
  Euro,
  Package,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface InventoryManagementProps {
  medicines?: Medicine[];
  onAddMedicine?: (medicine: Omit<Medicine, "id">) => void;
  onEditMedicine?: (id: string, medicine: Omit<Medicine, "id">) => void;
  onAddToCart?: (medicine: Medicine) => void;
  cartItemCount?: number;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({
  medicines = defaultMedicines,
  onAddMedicine = () => {},
  onEditMedicine = () => {},
  onAddToCart = () => {},
  cartItemCount = 0,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [statsFlash, setStatsFlash] = useState({
    totalItems: false,
    lowStock: false,
    cartItems: false,
  });

  const categories = [
    "painkillers",
    "antibiotics",
    "allergy",
    "digestive",
    "cardiovascular",
    "respiratory",
    "supplements",
    "mental health",
    "diabetes",
    "hormones",
    "cholesterol",
    "eye care",
    "topical",
  ];

  const totalItems = medicines.length;
  const lowStockCount = medicines.filter((med) => med.stock < 10).length;

  const flashStat = (statType: keyof typeof statsFlash) => {
    setStatsFlash((prev) => ({ ...prev, [statType]: true }));
    setTimeout(() => {
      setStatsFlash((prev) => ({ ...prev, [statType]: false }));
    }, 1000);
  };

  const handleOpenForm = (medicine?: Medicine) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setFormData({
        name: medicine.name,
        dosage: medicine.dosage,
        price: medicine.price.toString(),
        stock: medicine.stock.toString(),
        category: medicine.category,
        image: medicine.image || "",
      });
    } else {
      setEditingMedicine(null);
      setFormData({
        name: "",
        dosage: "",
        price: "",
        stock: "",
        category: "",
        image: "",
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMedicine(null);
    setFormData({
      name: "",
      dosage: "",
      price: "",
      stock: "",
      category: "",
      image: "",
    });
  };

  const handleSubmit = () => {
    const medicineData = {
      name: formData.name,
      dosage: formData.dosage,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      image: formData.image || undefined,
    };

    if (editingMedicine) {
      onEditMedicine(editingMedicine.id, medicineData);
    } else {
      onAddMedicine(medicineData);
      flashStat("totalItems");
      if (medicineData.stock < 10) {
        flashStat("lowStock");
      }
    }

    handleCloseForm();
  };

  const handleAddToCart = (medicine: Medicine) => {
    onAddToCart(medicine);
    flashStat("cartItems");
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.dosage.trim() &&
      formData.price &&
      !isNaN(parseFloat(formData.price)) &&
      formData.stock &&
      !isNaN(parseInt(formData.stock)) &&
      formData.category
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Inventory Management
              </h1>
              <p className="text-gray-600 text-sm">
                Add, edit, and manage your pharmacy inventory
              </p>
            </div>
            <Button
              onClick={() => handleOpenForm()}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Medicine
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Quick Stats Sidebar */}
          <div className="w-full lg:w-64 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  className={cn(
                    "flex justify-between items-center p-3 rounded-lg transition-colors",
                    statsFlash.totalItems
                      ? "bg-blue-100 border border-blue-200"
                      : "bg-gray-50",
                  )}
                  animate={statsFlash.totalItems ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Items</span>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {totalItems}
                  </Badge>
                </motion.div>

                <motion.div
                  className={cn(
                    "flex justify-between items-center p-3 rounded-lg transition-colors",
                    statsFlash.lowStock
                      ? "bg-amber-100 border border-amber-200"
                      : "bg-gray-50",
                  )}
                  animate={statsFlash.lowStock ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium">Low Stock</span>
                  </div>
                  <Badge
                    variant={lowStockCount > 0 ? "destructive" : "secondary"}
                    className="font-bold"
                  >
                    {lowStockCount}
                  </Badge>
                </motion.div>

                <motion.div
                  className={cn(
                    "flex justify-between items-center p-3 rounded-lg transition-colors",
                    statsFlash.cartItems
                      ? "bg-green-100 border border-green-200"
                      : "bg-gray-50",
                  )}
                  animate={statsFlash.cartItems ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Cart Items</span>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {cartItemCount}
                  </Badge>
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Scrollable Inventory Grid */}
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Medicine Inventory ({totalItems} items)
              </h2>
            </div>

            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {medicines.map((medicine) => (
                  <motion.div
                    key={medicine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
                        {medicine.image ? (
                          <img
                            src={medicine.image}
                            alt={medicine.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-blue-500 text-3xl">💊</div>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() => handleOpenForm(medicine)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                            {medicine.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            {medicine.dosage}
                          </p>
                          <Badge
                            variant={
                              medicine.stock > 10
                                ? "secondary"
                                : medicine.stock > 0
                                  ? "outline"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {medicine.stock > 0
                              ? `${medicine.stock} in stock`
                              : "Out of stock"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-blue-700 flex items-center">
                            <Euro className="h-4 w-4 mr-1" />
                            {medicine.price.toFixed(2)}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(medicine)}
                            disabled={medicine.stock <= 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 px-3 py-1.5 text-xs font-medium"
                          >
                            <Plus className="h-3 w-3" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Medicine Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
            </DialogTitle>
            <DialogDescription>
              {editingMedicine
                ? "Update the medicine information below."
                : "Fill in the details to add a new medicine to your inventory."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Medicine Name *
              </label>
              <Input
                placeholder="e.g., Aspirin"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Dosage/Quantity *
              </label>
              <Input
                placeholder="e.g., 500mg, 10ml"
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Price (€) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Stock Quantity *
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Category/Type *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Image URL (Optional)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
                <Button variant="outline" size="sm" className="px-3">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseForm}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingMedicine ? "Update" : "Add"} Medicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Default medicines for demonstration
const defaultMedicines: Medicine[] = [
  {
    id: "1",
    name: "Aspirin",
    dosage: "500mg",
    price: 5.99,
    stock: 42,
    category: "painkillers",
  },
  {
    id: "2",
    name: "Ibuprofen",
    dosage: "400mg",
    price: 6.49,
    stock: 28,
    category: "painkillers",
  },
  {
    id: "3",
    name: "Paracetamol",
    dosage: "500mg",
    price: 4.99,
    stock: 53,
    category: "painkillers",
  },
  {
    id: "4",
    name: "Amoxicillin",
    dosage: "250mg",
    price: 12.99,
    stock: 15,
    category: "antibiotics",
  },
  {
    id: "5",
    name: "Cetirizine",
    dosage: "10mg",
    price: 8.49,
    stock: 31,
    category: "allergy",
  },
  {
    id: "6",
    name: "Loratadine",
    dosage: "10mg",
    price: 7.99,
    stock: 22,
    category: "allergy",
  },
  {
    id: "7",
    name: "Omeprazole",
    dosage: "20mg",
    price: 9.99,
    stock: 18,
    category: "digestive",
  },
  {
    id: "8",
    name: "Simvastatin",
    dosage: "20mg",
    price: 11.49,
    stock: 9,
    category: "cholesterol",
  },
  {
    id: "9",
    name: "Metformin",
    dosage: "500mg",
    price: 8.99,
    stock: 24,
    category: "diabetes",
  },
  {
    id: "10",
    name: "Salbutamol Inhaler",
    dosage: "100mcg",
    price: 14.99,
    stock: 7,
    category: "respiratory",
  },
  {
    id: "11",
    name: "Fluoxetine",
    dosage: "20mg",
    price: 13.49,
    stock: 12,
    category: "mental health",
  },
  {
    id: "12",
    name: "Ramipril",
    dosage: "5mg",
    price: 10.99,
    stock: 16,
    category: "cardiovascular",
  },
  {
    id: "13",
    name: "Amlodipine",
    dosage: "5mg",
    price: 9.49,
    stock: 21,
    category: "cardiovascular",
  },
  {
    id: "14",
    name: "Levothyroxine",
    dosage: "50mcg",
    price: 7.49,
    stock: 3,
    category: "hormones",
  },
  {
    id: "15",
    name: "Diazepam",
    dosage: "5mg",
    price: 15.99,
    stock: 5,
    category: "mental health",
  },
  {
    id: "16",
    name: "Warfarin",
    dosage: "3mg",
    price: 8.79,
    stock: 14,
    category: "cardiovascular",
  },
];

export default InventoryManagement;
