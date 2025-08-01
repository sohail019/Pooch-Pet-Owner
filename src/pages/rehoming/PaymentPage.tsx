import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Shield, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  getRehomingPetById,
  processAdoptionPayment,
  AdoptionRequest,
  RehomingPet,
  PaymentProcessRequest 
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";
import { toast } from "react-toastify";

const PaymentPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  
  // State management
  const [adoptionRequest, setAdoptionRequest] = useState<AdoptionRequest | null>(null);
  const [pet, setPet] = useState<RehomingPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  // Load adoption request and pet details
  useEffect(() => {
    const loadData = async () => {
      if (!requestId) {
        setError("Invalid adoption request ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Note: In a real implementation, you would fetch the specific adoption request
        // For now, we'll simulate this with a basic structure
        
        // Mock adoption request data (replace with actual API call)
        const mockRequest: AdoptionRequest = {
          id: requestId,
          petId: "pet-123",
          adopterId: "user-123",
          message: "I would love to adopt this pet!",
          status: "accepted",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setAdoptionRequest(mockRequest);

        // Load pet details
        const petData = await getRehomingPetById(mockRequest.petId);
        setPet(petData);

      } catch (err) {
        console.error("Failed to load payment data:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [requestId]);

  // Handle payment processing
  const handlePayment = async () => {
    if (!adoptionRequest || !pet) {
      toast.error("Missing adoption request or pet information");
      return;
    }

    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
      toast.error("Please fill in all card details");
      return;
    }

    try {
      setProcessing(true);

      // In a real implementation, you would integrate with a payment gateway like Stripe
      // For now, we'll simulate a successful payment
      const mockPaymentIntent = {
        paymentIntentId: `pi_${Date.now()}`,
        status: "succeeded"
      };

      const paymentRequest: PaymentProcessRequest = {
        paymentMethod: "stripe",
        gatewayResponse: mockPaymentIntent
      };

      await processAdoptionPayment(adoptionRequest.id, paymentRequest);
      
      toast.success("Payment processed successfully! Funds are held in escrow.");
      navigate("/rehoming/transfer-confirmation");

    } catch (err) {
      console.error("Payment failed:", err);
      toast.error(handleApiError(err));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !adoptionRequest || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Payment Information</h2>
              <p className="text-gray-400 mb-6">{error || "Payment information not found"}</p>
              <Button 
                onClick={() => navigate("/rehoming")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rehoming
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const platformFee = (pet.price || 0) * 0.05; // 5% platform fee
  const totalAmount = (pet.price || 0) + platformFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Payment</h1>
              <p className="text-gray-400">Complete your adoption payment</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Adoption Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pet Details */}
              <div className="flex items-start space-x-4">
                {pet.imageUrls && pet.imageUrls.length > 0 && (
                  <img
                    src={pet.imageUrls[0]}
                    alt={pet.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{pet.name}</h3>
                  <p className="text-gray-400">{pet.breed} • {pet.age} years old</p>
                  <Badge className="mt-2 bg-blue-900 text-blue-300">
                    {pet.species}
                  </Badge>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="border-t border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Adoption Fee</span>
                  <span>${pet.price || 0}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Platform Fee (5%)</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Escrow Information */}
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-blue-300 font-medium">Secure Escrow Protection</h4>
                    <p className="text-blue-200 text-sm mt-1">
                      Your payment is held securely in escrow until both parties confirm the pet transfer is complete.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method */}
              <div>
                <Label className="text-gray-300">Payment Method</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg bg-gray-700">
                    <input
                      type="radio"
                      id="stripe"
                      name="payment-method"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-600"
                    />
                    <label htmlFor="stripe" className="text-white flex items-center flex-1">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Credit/Debit Card
                    </label>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardholderName" className="text-gray-300">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={cardDetails.cardholderName}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                {processing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pay ${totalAmount.toFixed(2)}
                  </div>
                )}
              </Button>

              {/* Security Notice */}
              <div className="text-center text-sm text-gray-400">
                <p>🔒 Your payment information is encrypted and secure</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
