import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle, Shield, User, Dog, Cat, MessageSquare, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  getAdoptionRequestById, 
  confirmAdopterTransfer, 
  confirmPetOwnerTransfer,
  AdoptionRequest 
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";
import { useAuth } from "@/hooks/useAuth";

const TransferConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const adoptionRequestId = location.state?.adoptionRequestId;

  const [request, setRequest] = useState<AdoptionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequestDetails = useCallback(async () => {
    if (!adoptionRequestId) {
      setError("No adoption request ID provided.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const requestData = await getAdoptionRequestById(adoptionRequestId);
      setRequest(requestData);
    } catch (err) {
      setError(handleApiError(err as Error));
    } finally {
      setLoading(false);
    }
  }, [adoptionRequestId]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  const handleConfirmation = async () => {
    if (!request || !user) return;

    setIsSubmitting(true);
    try {
      let updatedRequest;
      if (user.id === request.adopter.id) {
        updatedRequest = await confirmAdopterTransfer(request.id, confirmationMessage);
      } else if (user.id === request.pet.ownerId) {
        updatedRequest = await confirmPetOwnerTransfer(request.id, confirmationMessage);
      }
      setRequest(updatedRequest || null);
      setConfirmationMessage("");
    } catch (err) {
      // Error is handled by the controller's toast message
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = user?.id === request?.pet.ownerId;
  const hasOwnerConfirmed = request?.petOwnerConfirmation;
  const hasAdopterConfirmed = request?.adopterConfirmation;

  const renderStatusPill = (confirmed: boolean, text: string) => (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${confirmed ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
      {confirmed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
      <span>{text}</span>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <Card className="bg-red-900/20 border-red-700 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">An Error Occurred</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button onClick={() => navigate(-1)} variant="outline" className="border-gray-600 text-gray-200">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-3xl mx-auto">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-4 text-white hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="bg-gray-800/50 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              Pet Transfer Confirmation
            </CardTitle>
            <p className="text-gray-400">
              Confirm the successful transfer of {request.pet.name}. Both parties must confirm to release the payment.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg">
              {request.pet.species === 'dog' ? <Dog className="w-10 h-10 text-blue-300" /> : <Cat className="w-10 h-10 text-purple-300" />}
              <div>
                <h3 className="font-bold text-lg">{request.pet.name}</h3>
                <p className="text-sm text-gray-300">{request.pet.breed}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderStatusPill(!!hasOwnerConfirmed, hasOwnerConfirmed ? 'Owner Confirmed' : 'Awaiting Owner Confirmation')}
              {renderStatusPill(!!hasAdopterConfirmed, hasAdopterConfirmed ? 'Adopter Confirmed' : 'Awaiting Adopter Confirmation')}
            </div>

            {request.status === 'completed' ? (
              <div className="text-center p-6 bg-green-900/50 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Transfer Complete!</h3>
                <p className="text-gray-300">Both parties have confirmed the transfer. The payment has been released to the owner.</p>
              </div>
            ) : (
              <>
                {((isOwner && !hasOwnerConfirmed) || (!isOwner && !hasAdopterConfirmed)) && (
                  <div className="space-y-4 pt-4 border-t border-gray-700">
                    <Label htmlFor="confirmationMessage" className="font-medium text-lg">
                      Your Confirmation
                    </Label>
                    <Textarea
                      id="confirmationMessage"
                      value={confirmationMessage}
                      onChange={(e) => setConfirmationMessage(e.target.value)}
                      placeholder="Optional: Add a message about the transfer..."
                      rows={3}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <Button
                      onClick={handleConfirmation}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold"
                    >
                      {isSubmitting ? 'Submitting...' : `Confirm Transfer as ${isOwner ? 'Pet Owner' : 'Adopter'}`}
                    </Button>
                  </div>
                )}

                {((isOwner && hasOwnerConfirmed) || (!isOwner && hasAdopterConfirmed)) && (
                  <div className="text-center p-6 bg-blue-900/50 rounded-lg">
                    <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white">Confirmation Submitted!</h3>
                    <p className="text-gray-300">Thank you. We are now waiting for the other party to confirm the transfer.</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransferConfirmationPage;
