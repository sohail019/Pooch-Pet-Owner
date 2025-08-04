import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, FileText, MessageSquare, Shield, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  getMyTransactions,
  openDispute,
  RehomingTransaction,
  DisputeRequest,
  getTransactionStatusDisplay,
  getEscrowStatusDisplay,
  getDisputeStatusDisplay
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";
import { toast } from "react-toastify";

const DisputeManagementPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [transactions, setTransactions] = useState<RehomingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [openingDispute, setOpeningDispute] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState<string | null>(null);
  const [disputeForm, setDisputeForm] = useState({
    reason: "",
    evidence: ""
  });

  // Load transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const transactionData = await getMyTransactions();
        // Ensure transactions is always an array
        setTransactions(Array.isArray(transactionData) ? transactionData : []);

      } catch (err) {
        console.error("Failed to load transactions:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Handle opening a dispute
  const handleOpenDispute = async (transactionId: string) => {
    if (!disputeForm.reason.trim() || !disputeForm.evidence.trim()) {
      toast.error("Please provide both reason and evidence for the dispute");
      return;
    }

    try {
      setOpeningDispute(transactionId);

      const payload: DisputeRequest = {
        transactionId,
        reason: disputeForm.reason,
        evidence: disputeForm.evidence
      };

      await openDispute(payload);
      
      // Update local state
      setTransactions(prev => 
        prev.map(t => 
          t.id === transactionId 
            ? { ...t, disputeStatus: "open" }
            : t
        )
      );

      // Reset form and close modal
      setDisputeForm({ reason: "", evidence: "" });
      setShowDisputeForm(null);

    } catch (err) {
      console.error("Failed to open dispute:", err);
      toast.error(handleApiError(err));
    } finally {
      setOpeningDispute(null);
    }
  };

  // Cancel dispute form
  const handleCancelDispute = () => {
    setShowDisputeForm(null);
    setDisputeForm({ reason: "", evidence: "" });
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

  // Filter transactions that can have disputes (completed transactions)
  const eligibleTransactions = transactions.filter(t => t.status === "completed");
  const disputedTransactions = transactions.filter(t => t.disputeStatus === "open");

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
              <h1 className="text-3xl font-bold text-white">Dispute Management</h1>
              <p className="text-gray-400">Manage payment disputes and transaction issues</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-700 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-red-300 font-medium">Error Loading Transactions</h3>
                  <p className="text-red-200 text-sm mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Disputes */}
        {disputedTransactions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Active Disputes</h2>
            <div className="space-y-4">
              {disputedTransactions.map((transaction) => (
                <Card key={transaction.id} className="bg-red-900/20 border-red-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                        Dispute - {transaction.adoptionRequest.pet.name}
                      </div>
                      <Badge className="bg-red-900 text-red-300">
                        <Clock className="w-4 h-4 mr-1" />
                        Open
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Amount:</span>
                        <p className="text-white font-medium">${Number(transaction.amount || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Adopter:</span>
                        <p className="text-white font-medium">{transaction?.fromUser.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Status:</span>
                        <Badge className={getDisputeStatusDisplay(transaction.disputeStatus).color}>
                          {getDisputeStatusDisplay(transaction.disputeStatus).label}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                          <h4 className="text-yellow-300 font-medium">Dispute Under Review</h4>
                          <p className="text-yellow-200 text-sm mt-1">
                            Our team is reviewing your dispute. You will be contacted within 24-48 hours for additional information if needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Eligible Transactions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Transaction History</h2>
          
          {eligibleTransactions.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Completed Transactions</h3>
                <p className="text-gray-400 mb-6">
                  You don't have any completed transactions that are eligible for disputes.
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
            <div className="space-y-4">
              {eligibleTransactions.map((transaction) => (
                <Card key={transaction.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        {transaction.adoptionRequest.pet.name} - Transaction
                      </div>
                      <Badge className={getTransactionStatusDisplay(transaction.status).color}>
                        {getTransactionStatusDisplay(transaction.status).label}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Transaction Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Amount:</span>
                        <p className="text-white font-medium">${Number(transaction.amount || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Platform Fee:</span>
                        <p className="text-white font-medium">${Number(transaction.platformFee || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Net Amount:</span>
                        <p className="text-green-400 font-medium">${Number(transaction.netAmount || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Escrow Status:</span>
                        <Badge className={getEscrowStatusDisplay(transaction.escrowStatus).color}>
                          {getEscrowStatusDisplay(transaction.escrowStatus).label}
                        </Badge>
                      </div>
                    </div>

                    {/* Adopter Information */}
                    <div>
                      <h4 className="text-white font-medium mb-2">Adopter Information</h4>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{transaction?.fromUser.name}</p>
                            <p className="text-gray-400 text-sm">{transaction?.fromUser.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dispute Actions */}
                    {transaction.disputeStatus === "none" && (
                      <div className="border-t border-gray-700 pt-6">
                        {showDisputeForm === transaction.id ? (
                          <div className="space-y-4">
                            <h4 className="text-white font-medium">Open Dispute</h4>
                            <div>
                              <Label htmlFor="dispute-reason" className="text-gray-300">
                                Dispute Reason
                              </Label>
                              <Input
                                id="dispute-reason"
                                placeholder="e.g., Pet not as described, Health issues not disclosed"
                                value={disputeForm.reason}
                                onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })}
                                className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="dispute-evidence" className="text-gray-300">
                                Evidence/Description
                              </Label>
                              <Textarea
                                id="dispute-evidence"
                                placeholder="Please provide detailed evidence and description of the issue..."
                                value={disputeForm.evidence}
                                onChange={(e) => setDisputeForm({ ...disputeForm, evidence: e.target.value })}
                                className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                rows={4}
                              />
                            </div>
                            <div className="flex space-x-4">
                              <Button
                                onClick={() => handleOpenDispute(transaction.id)}
                                disabled={openingDispute === transaction.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {openingDispute === transaction.id ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Opening Dispute...
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Submit Dispute
                                  </div>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleCancelDispute}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => setShowDisputeForm(transaction.id)}
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Open Dispute
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <Card className="bg-blue-900/20 border-blue-700 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-blue-300 font-medium">Dispute Process</h3>
                <p className="text-blue-200 text-sm mt-1">
                  You can open a dispute for any completed transaction within 30 days. Common reasons include pet health issues not disclosed, 
                  pet not matching description, or transfer complications. Our support team will review all disputes fairly and may request 
                  additional documentation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisputeManagementPage;
