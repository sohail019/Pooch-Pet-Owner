import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, User, PawPrint, AlertCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  getPendingTransfers,
  confirmTransferPetOwner,
  confirmTransferAdopter,
  PendingTransfer,
  TransferConfirmationRequest 
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";
import { toast } from "react-toastify";

const TransferConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirmationMessages, setConfirmationMessages] = useState<Record<string, string>>({});

  // Load pending transfers
  useEffect(() => {
    const loadPendingTransfers = async () => {
      try {
        setLoading(true);
        setError("");

        const transfers = await getPendingTransfers();
        // Ensure transfers is always an array
        setPendingTransfers(Array.isArray(transfers) ? transfers : []);

      } catch (err) {
        console.error("Failed to load pending transfers:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadPendingTransfers();
  }, []);

  // Handle pet owner confirmation
  const handlePetOwnerConfirmation = async (transfer: PendingTransfer) => {
    const message = confirmationMessages[transfer.id] || "";
    
    if (!message.trim()) {
      toast.error("Please provide a confirmation message");
      return;
    }

    try {
      setConfirmingId(transfer.id);

      const payload: TransferConfirmationRequest = {
        adoptionRequestId: transfer.id,
        confirmationMessage: message
      };

      await confirmTransferPetOwner(payload);
      
      // Update local state
      setPendingTransfers(prev => 
        prev.map(t => 
          t.id === transfer.id 
            ? { ...t, petOwnerConfirmation: true }
            : t
        )
      );

      // Clear the message
      setConfirmationMessages(prev => ({ ...prev, [transfer.id]: "" }));

    } catch (err) {
      console.error("Failed to confirm transfer as pet owner:", err);
      toast.error(handleApiError(err));
    } finally {
      setConfirmingId(null);
    }
  };

  // Handle adopter confirmation
  const handleAdopterConfirmation = async (transfer: PendingTransfer) => {
    const message = confirmationMessages[transfer.id] || "";
    
    if (!message.trim()) {
      toast.error("Please provide a confirmation message");
      return;
    }

    try {
      setConfirmingId(transfer.id);

      const payload: TransferConfirmationRequest = {
        adoptionRequestId: transfer.id,
        confirmationMessage: message
      };

      await confirmTransferAdopter(payload);
      
      // Update local state
      setPendingTransfers(prev => 
        prev.map(t => 
          t.id === transfer.id 
            ? { ...t, adopterConfirmation: true }
            : t
        )
      );

      // Clear the message
      setConfirmationMessages(prev => ({ ...prev, [transfer.id]: "" }));

    } catch (err) {
      console.error("Failed to confirm transfer as adopter:", err);
      toast.error(handleApiError(err));
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-6xl mx-auto pt-20">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto pt-20">
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
              <h1 className="text-3xl font-bold text-white">Transfer Confirmations</h1>
              <p className="text-gray-400">Confirm pet transfers to complete adoptions</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-700 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-red-300 font-medium">Error Loading Transfers</h3>
                  <p className="text-red-200 text-sm mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Transfers */}
        {pendingTransfers.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No Pending Transfers</h2>
              <p className="text-gray-400 mb-6">
                All your adoptions are up to date. No transfers require confirmation at this time.
              </p>
              <Button 
                onClick={() => navigate("/rehoming")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Rehoming Listings
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingTransfers.map((transfer) => (
              <Card key={transfer.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <PawPrint className="w-5 h-5 mr-2" />
                      {transfer.pet.name} Transfer
                    </div>
                    <Badge className="bg-yellow-900 text-yellow-300">
                      <Clock className="w-4 h-4 mr-1" />
                      Pending
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Transfer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pet Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Pet Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{transfer.pet.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Species:</span>
                          <span className="text-white capitalize">{transfer.pet.species}</span>
                        </div>
                      </div>
                    </div>

                    {/* Adopter Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Adopter Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{transfer.adopter.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white">{transfer.adopter.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Status */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Confirmation Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Pet Owner Confirmation */}
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-blue-400" />
                          <span className="text-white">Pet Owner</span>
                        </div>
                        {transfer.petOwnerConfirmation ? (
                          <Badge className="bg-green-900 text-green-300">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-900 text-yellow-300">
                            <Clock className="w-4 h-4 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>

                      {/* Adopter Confirmation */}
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <PawPrint className="w-5 h-5 text-green-400" />
                          <span className="text-white">Adopter</span>
                        </div>
                        {transfer.adopterConfirmation ? (
                          <Badge className="bg-green-900 text-green-300">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-900 text-yellow-300">
                            <Clock className="w-4 h-4 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Actions */}
                  {(!transfer.petOwnerConfirmation || !transfer.adopterConfirmation) && (
                    <div className="border-t border-gray-700 pt-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`message-${transfer.id}`} className="text-gray-300">
                            Confirmation Message
                          </Label>
                          <Textarea
                            id={`message-${transfer.id}`}
                            placeholder="Please provide details about the transfer..."
                            value={confirmationMessages[transfer.id] || ""}
                            onChange={(e) => setConfirmationMessages(prev => ({
                              ...prev,
                              [transfer.id]: e.target.value
                            }))}
                            className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            rows={3}
                          />
                        </div>

                        <div className="flex space-x-4">
                          {!transfer.petOwnerConfirmation && (
                            <Button
                              onClick={() => handlePetOwnerConfirmation(transfer)}
                              disabled={confirmingId === transfer.id}
                              className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                              {confirmingId === transfer.id ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Confirming...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  Confirm as Pet Owner
                                </div>
                              )}
                            </Button>
                          )}

                          {!transfer.adopterConfirmation && (
                            <Button
                              onClick={() => handleAdopterConfirmation(transfer)}
                              disabled={confirmingId === transfer.id}
                              className="bg-green-600 hover:bg-green-700 flex-1"
                            >
                              {confirmingId === transfer.id ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Confirming...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <PawPrint className="w-4 h-4 mr-2" />
                                  Confirm as Adopter
                                </div>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Completion Message */}
                  {transfer.petOwnerConfirmation && transfer.adopterConfirmation && (
                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <div>
                          <h4 className="text-green-300 font-medium">Transfer Complete!</h4>
                          <p className="text-green-200 text-sm mt-1">
                            Both parties have confirmed the transfer. Funds will be released from escrow.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="bg-blue-900/20 border-blue-700 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-blue-300 font-medium">Transfer Process</h3>
                <p className="text-blue-200 text-sm mt-1">
                  Both the pet owner and adopter must confirm the transfer before funds are released from escrow. 
                  Please only confirm once the pet has been safely transferred to the new owner.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransferConfirmationPage;
