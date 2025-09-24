import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Application information and settings
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Germany Meds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Application Overview</h3>
                <p className="text-sm text-muted-foreground">
                  Germany Meds is a comprehensive pharmacy management system designed to streamline inventory management, 
                  sales tracking, and customer service for pharmaceutical businesses.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Owner Information</h3>
                <p className="text-sm font-medium">PRISHNEX</p>
                <p className="text-sm text-muted-foreground">CEO & Founder</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Version Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Version:</span>
                  <span>1.0.0</span>
                  <span className="text-muted-foreground">Released:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                  <span className="text-muted-foreground">Framework:</span>
                  <span>React + Vite</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Contact Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span>contact@prishnex.com</span>
                  <span className="text-muted-foreground">Phone:</span>
                  <span>9692693851</span>
                  <span className="text-muted-foreground">Address:</span>
                  <span>Hauptstraße 1, 10115 Berlin, Germany</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                  <span className="text-muted-foreground">Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                  <span className="text-muted-foreground">Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} PRISHNEX. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Germany Meds is a registered trademark of PRISHNEX GmbH.
              </p>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Settings;