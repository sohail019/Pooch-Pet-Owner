import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, DollarSign, Calendar, Eye, AlertTriangle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getMyTransactions,
  RehomingTransaction,
  getTransactionStatusDisplay,
  getEscrowStatusDisplay,
  getDisputeStatusDisplay
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";

const TransactionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [transactions, setTransactions] = useState<RehomingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const transactionData = await getMyTransactions();
        // Ensure transactions is always an array and validate data
        const validTransactions = Array.isArray(transactionData) ? transactionData.filter(t => t && typeof t === 'object') : [];
        setTransactions(validTransactions);
        
        console.log("✅ Loaded transactions:", validTransactions.length, validTransactions);

      } catch (err) {
        console.error("Failed to load transactions:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="w-full max-w-md bg-gray-800/80 rounded-xl shadow-lg p-8 flex flex-col items-center">
          {/* Shimmer skeleton for card */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse mb-6" />
          <div className="w-40 h-6 rounded bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse mb-2" />
          <div className="w-56 h-4 rounded bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse" />
          <span className="text-gray-300 text-lg font-medium mt-8">
            Loading transactions...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4">
      <div className="w-full max-w-6xl mx-auto pt-8 sm:pt-20">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title and subtitle */}
            <div className="flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 shadow-lg transition-all sm:mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1 drop-shadow-lg">
                Transaction History
              </h1>
              <p className="text-gray-400 text-base font-medium">
                All your adoption payments and transactions in one place.
              </p>
            </div>
            {/* Row for back arrow and Manage Disputes button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
              <Button
                onClick={() => navigate("/rehoming/dispute-management")}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/30 bg-gray-800 hover:text-white font-semibold shadow-md transition-all"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Manage Disputes
              </Button>
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
                  <h3 className="text-red-300 font-medium">
                    Error Loading Transactions
                  </h3>
                  <p className="text-red-200 text-sm mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Summary */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="bg-gray-800 border-gray-700 w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Transactions</p>
                    <p className="text-2xl font-bold text-white">
                      {transactions.length}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Received</p>
                    <p className="text-2xl font-bold text-green-400">
                      ₹
                      {transactions
                        .reduce((sum, t) => sum + (Number(t.netAmount) || 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">In Escrow</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      ₹
                      {transactions
                        .filter((t) => t && t.escrowStatus === "held")
                        .reduce((sum, t) => sum + (Number(t.netAmount) || 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                No Transactions Found
              </h2>
              <p className="text-gray-400 mb-6">
                You don't have any adoption transactions yet. Start by listing
                pets for adoption.
              </p>
              <Button
                onClick={() => navigate("/rehoming/create")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                List a Pet for Adoption
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {transactions.map((transaction) => (
              <Card
                key={transaction.id}
                className="bg-gray-800 border-gray-700 w-full max-w-full"
              >
                <CardHeader>
                  <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      {transaction.adoptionRequest?.pet?.name ||
                        "Unknown Pet"}{" "}
                      - Adoption Payment
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <Badge
                        className={
                          getTransactionStatusDisplay(transaction.status).color
                        }
                      >
                        {getTransactionStatusDisplay(transaction.status).label}
                      </Badge>
                      <Badge
                        className={
                          getEscrowStatusDisplay(transaction.escrowStatus).color
                        }
                      >
                        {getEscrowStatusDisplay(transaction.escrowStatus).label}
                      </Badge>
                      {transaction.disputeStatus &&
                        transaction.disputeStatus !== "none" && (
                          <Badge
                            className={
                              getDisputeStatusDisplay(transaction.disputeStatus)
                                .color
                            }
                          >
                            {
                              getDisputeStatusDisplay(transaction.disputeStatus)
                                .label
                            }
                          </Badge>
                        )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Transaction Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                      <p className="text-gray-400 text-sm">Gross Amount</p>
                      <p className="text-white text-lg font-semibold">
                        ₹{(Number(transaction.amount) || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                      <p className="text-gray-400 text-sm">Platform Fee</p>
                      <p className="text-red-400 text-lg font-semibold">
                        -₹{(Number(transaction.platformFee) || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                      <p className="text-gray-400 text-sm">Net Amount</p>
                      <p className="text-green-400 text-lg font-semibold">
                        ₹{(Number(transaction.netAmount) || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white text-sm font-medium">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Adoption Details */}
                  <div className="border-t border-gray-700 pt-6">
                    <h4 className="text-white font-medium mb-4">
                      Adoption Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pet Information */}
                      <div>
                        <h5 className="text-gray-300 font-medium mb-2">
                          Pet Information
                        </h5>
                        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Name:</span>
                            <span className="text-white">
                              {transaction.adoptionRequest?.pet?.name ||
                                "Unknown Pet"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Adopter Information */}
                      <div>
                        <h5 className="text-gray-300 font-medium mb-2">
                          Adopter Information
                        </h5>
                        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Name:</span>
                            <span className="text-white">
                              {transaction?.fromUser?.name || "Unknown Adopter"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Email:</span>
                            <span className="text-white">
                              {transaction?.fromUser?.email || "Unknown Email"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Status Messages */}
                  {transaction.escrowStatus === "held" && (
                    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                          <h4 className="text-yellow-300 font-medium">
                            Funds Held in Escrow
                          </h4>
                          <p className="text-yellow-200 text-sm mt-1">
                            Payment is securely held until both parties confirm
                            the pet transfer. Funds will be released
                            automatically once transfer is confirmed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {transaction.disputeStatus === "open" && (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div>
                          <h4 className="text-red-300 font-medium">
                            Dispute Active
                          </h4>
                          <p className="text-red-200 text-sm mt-1">
                            This transaction has an active dispute. Our support
                            team is reviewing the case.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    {transaction.status === "completed" &&
                      transaction.disputeStatus === "none" && (
                        <Button
                          onClick={() =>
                            navigate("/rehoming/dispute-management")
                          }
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-900/20"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Open Dispute
                        </Button>
                      )}
                    <Button
                      onClick={() =>
                        navigate(`/rehoming/transaction/${transaction.id}`)
                      }
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
