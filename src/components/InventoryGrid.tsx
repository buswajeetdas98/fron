import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// Removed internal ScrollArea to avoid nested scrollbars and clipping
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter, Plus } from "lucide-react";

interface MedicineItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface InventoryGridProps {
  items?: MedicineItem[];
  onAddToCart?: (item: MedicineItem) => void;
}

const InventoryGrid = ({
  items = defaultItems,
  onAddToCart = () => {},
}: InventoryGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter items based on search term and category
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Get unique categories for filter dropdown
  const categories = [
    "all",
    ...Array.from(new Set(items.map((item) => item.category))),
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm w-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center p-6 pb-4 gap-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search medicines..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </div>
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
        </div>
      </div>

      <div className="px-6 pb-6">
          {currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p>No medicines found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {currentItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-md transition-shadow h-full"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center aspect-[4/3]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-blue-500 text-3xl">💊</div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <Badge
                        variant={
                          item.stock > 10
                            ? "secondary"
                            : item.stock > 0
                              ? "outline"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {item.stock > 0
                          ? `${item.stock} in stock`
                          : "Out of stock"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-lg font-bold text-blue-700">
                        €{item.price.toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(item)}
                        disabled={item.stock <= 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 px-3 py-1.5 text-xs font-medium"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
      </div>

      {filteredItems.length > itemsPerPage && (
        <div className="px-6 pb-6 pt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

// Default items for demonstration
const defaultItems: MedicineItem[] = [
  {
    id: "1",
    name: "Aspirin 500mg",
    price: 5.99,
    stock: 42,
    category: "painkillers",
  },
  {
    id: "2",
    name: "Ibuprofen 400mg",
    price: 6.49,
    stock: 28,
    category: "painkillers",
  },
  {
    id: "3",
    name: "Paracetamol 500mg",
    price: 4.99,
    stock: 53,
    category: "painkillers",
  },
  {
    id: "4",
    name: "Amoxicillin 250mg",
    price: 12.99,
    stock: 15,
    category: "antibiotics",
  },
  {
    id: "5",
    name: "Cetirizine 10mg",
    price: 8.49,
    stock: 31,
    category: "allergy",
  },
  {
    id: "6",
    name: "Loratadine 10mg",
    price: 7.99,
    stock: 22,
    category: "allergy",
  },
  {
    id: "7",
    name: "Omeprazole 20mg",
    price: 9.99,
    stock: 18,
    category: "digestive",
  },
  {
    id: "8",
    name: "Simvastatin 20mg",
    price: 11.49,
    stock: 9,
    category: "cholesterol",
  },
  {
    id: "9",
    name: "Metformin 500mg",
    price: 8.99,
    stock: 24,
    category: "diabetes",
  },
  {
    id: "10",
    name: "Salbutamol Inhaler",
    price: 14.99,
    stock: 7,
    category: "respiratory",
  },
  {
    id: "11",
    name: "Fluoxetine 20mg",
    price: 13.49,
    stock: 12,
    category: "mental health",
  },
  {
    id: "12",
    name: "Ramipril 5mg",
    price: 10.99,
    stock: 16,
    category: "cardiovascular",
  },
  {
    id: "13",
    name: "Amlodipine 5mg",
    price: 9.49,
    stock: 21,
    category: "cardiovascular",
  },
  {
    id: "14",
    name: "Levothyroxine 50mcg",
    price: 7.49,
    stock: 0,
    category: "hormones",
  },
  {
    id: "15",
    name: "Diazepam 5mg",
    price: 15.99,
    stock: 5,
    category: "mental health",
  },
  {
    id: "16",
    name: "Warfarin 3mg",
    price: 8.79,
    stock: 14,
    category: "cardiovascular",
  },
  {
    id: "17",
    name: "Cough Syrup 120ml",
    price: 9.99,
    stock: 35,
    category: "respiratory",
  },
  {
    id: "18",
    name: "Vitamin C 1000mg",
    price: 6.99,
    stock: 48,
    category: "supplements",
  },
  {
    id: "19",
    name: "Throat Lozenges",
    price: 4.49,
    stock: 67,
    category: "respiratory",
  },
  {
    id: "20",
    name: "Antacid Tablets",
    price: 5.79,
    stock: 29,
    category: "digestive",
  },
  {
    id: "21",
    name: "Eye Drops 10ml",
    price: 8.99,
    stock: 18,
    category: "eye care",
  },
  {
    id: "22",
    name: "Nasal Spray",
    price: 7.49,
    stock: 25,
    category: "respiratory",
  },
  {
    id: "23",
    name: "Multivitamin Tablets",
    price: 12.99,
    stock: 41,
    category: "supplements",
  },
  {
    id: "24",
    name: "Antiseptic Cream",
    price: 6.49,
    stock: 33,
    category: "topical",
  },
  {
    id: "25",
    name: "Calcium Tablets",
    price: 8.99,
    stock: 52,
    category: "supplements",
  },
  {
    id: "26",
    name: "Iron Supplements",
    price: 9.49,
    stock: 27,
    category: "supplements",
  },
  {
    id: "27",
    name: "Probiotic Capsules",
    price: 15.99,
    stock: 19,
    category: "digestive",
  },
  {
    id: "28",
    name: "Hydrocortisone Cream",
    price: 7.99,
    stock: 14,
    category: "topical",
  },
  {
    id: "29",
    name: "Zinc Tablets",
    price: 6.99,
    stock: 38,
    category: "supplements",
  },
  {
    id: "30",
    name: "Magnesium Capsules",
    price: 11.49,
    stock: 23,
    category: "supplements",
  },
  {
    id: "31",
    name: "Omega-3 Fish Oil",
    price: 13.99,
    stock: 31,
    category: "supplements",
  },
  {
    id: "32",
    name: "Allergy Relief Spray",
    price: 9.99,
    stock: 16,
    category: "allergy",
  },
];

export default InventoryGrid;
