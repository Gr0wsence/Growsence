import { useEffect, useState } from "react";
import { useLocation, useRouter } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PaymentCallback() {
  const [location] = useLocation();
  const [, setLocation] = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("order_id");
    
    if (!orderId) {
      setStatus("failed");
      return;
    }

    // Verify payment status
    verifyPayment(orderId);
  }, [location]);

  const verifyPayment = async (orderId: string) => {
    try {
      // Check payment status
      const statusResponse = await apiRequest(`/api/payments/status/${orderId}`);
      
      if (statusResponse.order_status === "PAID") {
        setStatus("success");
        setOrderDetails(statusResponse);
        
        // Optionally verify with backend
        // await apiRequest("/api/payments/verify", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ orderId, userId: 1 }), // Get actual user ID
        // });
        
        toast({
          title: "Payment Successful!",
          description: "Your course enrollment is confirmed.",
        });
      } else {
        setStatus("failed");
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setStatus("failed");
      toast({
        title: "Payment Verification Error",
        description: "Unable to verify payment status.",
        variant: "destructive",
      });
    }
  };

  const handleReturnHome = () => {
    setLocation("/");
  };

  const handleGoToDashboard = () => {
    setLocation("/dashboard");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
              <h2 className="text-xl font-semibold">Verifying Payment...</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700 dark:text-green-400">
              Payment Successful!
            </CardTitle>
            <CardDescription>
              Your course enrollment has been confirmed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Order ID:</span>
                    <span className="font-mono">{orderDetails.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span>₹{orderDetails.order_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className="text-green-600 font-medium">PAID</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleGoToDashboard}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReturnHome}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700 dark:text-red-400">
            Payment Failed
          </CardTitle>
          <CardDescription>
            Unfortunately, your payment could not be processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">
              Your payment was not successful. Please try again or contact support if the issue persists.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleReturnHome}
              className="w-full"
            >
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReturnHome}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}