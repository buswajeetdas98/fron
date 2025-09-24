import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const emailSchema = z.string().trim().email();

type Stage = "details" | "otp";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5174";
  const [stage, setStage] = useState<Stage>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("gm_auth_token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  async function requestOtp() {
    setError(null);
    setInfo(null);
    const valid = emailSchema.safeParse(email);
    if (!valid.success) {
      setError("Invalid email");
      return;
    }
    setLoading(true);
    
    try {
      // Use the API endpoint through the Vite proxy
      const response = await fetch(`/api/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setStage("otp");
        setInfo(data.message || "OTP has been sent to your email");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error requesting OTP:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const verifyOtp = async () => {
    setError(null);
    
    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (data.ok && data.token) {
        localStorage.setItem("gm_auth_token", data.token);
        localStorage.setItem("gm_user_name", name || data.name || "User");
        localStorage.setItem("gm_user_email", email);
        navigate("/", { replace: true });
      } else {
        setError(data.error || "Invalid OTP");
        setAttempts(prev => prev + 1);
        
        // If too many attempts, suggest requesting new OTP
        if (response.status === 429) {
          setError("Too many attempts. Please request a new OTP.");
        }
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Germany Meds</CardTitle>
          <CardDescription>Login with your email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stage === "details" && (
            <>
              <div className="space-y-2">
                <label className="text-sm">Name</label>
                <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} spellCheck={false} autoComplete="off" autoCapitalize="none" autoCorrect="off" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Email</label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} spellCheck={false} autoComplete="off" autoCapitalize="none" autoCorrect="off" />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {info && <p className="text-amber-600 text-sm">{info}</p>}
              <Button className="w-full" onClick={requestOtp} disabled={loading}>
                {loading ? "Sending OTP..." : "Continue"}
              </Button>
            </>
          )}
          {stage === "otp" && (
            <>
              <div className="space-y-2">
                <label className="text-sm">Enter OTP</label>
                <Input 
                  placeholder="6-digit code" 
                  value={otp} 
                  onChange={handleOtpChange}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {info && <p className="text-amber-600 text-sm">{info}</p>}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={verifyOtp} disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </Button>
                <Button variant="outline" onClick={requestOtp} disabled={loading}>Resend OTP</Button>
              </div>
              <Button variant="ghost" onClick={() => {
                setStage("details");
                setOtp("");
                setError(null);
                setInfo(null);
                setAttempts(0);
              }}>Back</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;


