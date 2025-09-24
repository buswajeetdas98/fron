import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Get user information from localStorage
    const name = localStorage.getItem("gm_user_name") || "User";
    setUserName(name);
    
    // Try to get email from JWT token if available
    const token = localStorage.getItem("gm_auth_token");
    if (token) {
      try {
        // JWT tokens are in format: header.payload.signature
        const payload = token.split('.')[1];
        // Decode the base64 payload
        const decodedPayload = JSON.parse(atob(payload));
        if (decodedPayload.email) {
          setUserEmail(decodedPayload.email);
        }
      } catch (error) {
        console.error("Error parsing JWT token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("gm_auth_token");
    localStorage.removeItem("gm_user_name");
    navigate("/login");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>
            Your account information and preferences
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="" />
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{userName}</h2>
          {userEmail && <p className="text-muted-foreground">{userEmail}</p>}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <p className="text-sm font-medium">{userName}</p>
            </div>
            {userEmail && (
              <div className="space-y-1">
                <Label>Email</Label>
                <p className="text-sm font-medium">{userEmail}</p>
              </div>
            )}
            <div className="space-y-1">
              <Label>Role</Label>
              <p className="text-sm font-medium">Administrator</p>
            </div>
            <div className="space-y-1">
              <Label>Last Login</Label>
              <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <SheetFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;