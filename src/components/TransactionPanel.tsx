import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Euro,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle,
  Printer,
  Download,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface TransactionPanelProps {
  cartItems?: CartItem[];
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onCompleteSale?: () => void;
}

const TransactionPanel: React.FC<TransactionPanelProps> = ({
  cartItems = [
    {
      id: "1",
      name: "Aspirin 500mg",
      price: 5.99,
      quantity: 2,
      category: "Pain Relief",
    },
    {
      id: "2",
      name: "Vitamin C 1000mg",
      price: 8.5,
      quantity: 1,
      category: "Supplements",
    },
    {
      id: "3",
      name: "Allergy Relief",
      price: 12.75,
      quantity: 1,
      category: "Allergy",
    },
  ],
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onCompleteSale = () => {},
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCompleteSale = () => {
    setIsDialogOpen(true);
  };

  const confirmSale = () => {
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      // Reset and close dialog after showing completion
      setTimeout(() => {
        setIsCompleted(false);
        setIsDialogOpen(false);
        onCompleteSale();
      }, 1500);
    }, 2000);
  };

  const handleUpdateQuantity = (id: string, change: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const generateInvoiceId = () => {
    return `INV-${Date.now().toString().slice(-8)}`;
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const InvoicePreview = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Germany Meds
          </h1>
          <p className="text-gray-600">Pharmacy & Healthcare Solutions</p>
          <p className="text-sm text-gray-500 mt-1">
            Hauptstraße 123, 10115 Berlin, Germany
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">INVOICE</h2>
          <p className="text-sm text-gray-600">
            <strong>Invoice ID:</strong> {generateInvoiceId()}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Date & Time:</strong> {getCurrentDateTime()}
          </p>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Invoice Items Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Items Purchased
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">
                  Medicine Name
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">
                  Category
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-800">
                  Quantity
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">
                  Price (EUR)
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">
                  Subtotal (EUR)
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">
                    {item.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">
                    €{item.price.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">
                    €{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-600">Total Items:</span>
            <span className="font-semibold text-gray-800">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b-2 border-blue-800">
            <span className="text-lg font-semibold text-gray-800">
              Total Amount:
            </span>
            <span className="text-xl font-bold text-blue-800 flex items-center">
              <Euro size={18} className="mr-1" />
              {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
        <p>Thank you for choosing Germany Meds!</p>
        <p className="mt-1">
          For any queries, please contact us at info@germanymeds.de
        </p>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center text-blue-800">
          <ShoppingCart className="mr-2" size={20} />
          Transaction Cart
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {cartItems.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <ShoppingCart className="mx-auto mb-2 text-gray-400" size={40} />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="max-h-[450px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 last:mb-0 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </h3>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {item.category}
                    </Badge>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Euro size={12} className="mr-1" />
                      {item.price.toFixed(2)} × {item.quantity} =
                      <span className="font-semibold text-blue-700 ml-1">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                    <div className="flex items-center bg-white rounded-md border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="mx-2 min-w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col p-4">
        <div className="mb-4 flex w-full items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </span>
          <span className="text-lg font-bold text-blue-800 flex items-center">
            <Euro size={18} className="mr-1" />
            {totalAmount.toFixed(2)}
          </span>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={cartItems.length === 0}
          onClick={handleCompleteSale}
        >
          Complete Sale
        </Button>
      </CardFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className={
            showInvoice ? "max-w-5xl max-h-[90vh] overflow-y-auto" : ""
          }
        >
          <DialogHeader>
            <DialogTitle>
              {showInvoice
                ? "Invoice Preview"
                : isCompleted
                  ? "Sale Complete"
                  : "Confirm Sale"}
            </DialogTitle>
            <DialogDescription>
              {showInvoice ? (
                <div className="text-sm text-gray-600 mb-4">
                  Review your invoice below. You can print or download it as a
                  PDF.
                </div>
              ) : isCompleted ? (
                <div className="flex flex-col items-center py-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </motion.div>
                  <p className="mt-4">Transaction processed successfully!</p>
                </div>
              ) : (
                <div className="py-2">
                  <p>Are you sure you want to complete this sale?</p>
                  <div className="mt-4 rounded-md bg-blue-50 p-3">
                    <p className="font-medium">
                      Total: <Euro className="inline" size={14} />{" "}
                      {totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {showInvoice && (
            <div className="mt-4">
              <InvoicePreview />
            </div>
          )}

          {showInvoice ? (
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowInvoice(false)}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrintInvoice}
                  className="flex items-center"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="flex items-center bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </DialogFooter>
          ) : isCompleted ? (
            <DialogFooter>
              <Button
                onClick={() => setShowInvoice(true)}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button onClick={confirmSale} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TransactionPanel;
