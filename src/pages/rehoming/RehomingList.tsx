import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Heart,
    Verified,
    DollarSign,
    ArrowRight,
    Dog,
    Cat,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
    getRehomingPets,
    RehomingPet,
    RehomingFilters,
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";

const RehomingList: React.FC = () => {
    const navigate = useNavigate();

    // State management
    const [pets, setPets] = useState<RehomingPet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<RehomingFilters>({
        page: 1,
        limit: 12,
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
    });
    const [showFilters, setShowFilters] = useState(false);

    // Fetch pets data
    const fetchPets = useCallback(
        async (appliedFilters: RehomingFilters = {}) => {
            try {
                setLoading(true);
                setError("");

                const searchFilters = {
                    ...filters,
                    ...appliedFilters,
                    search: searchTerm || undefined,
                };

                const result = await getRehomingPets(searchFilters);

                setPets(result.pets);
                setPagination({
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                });
            } catch (err: unknown) {
                const errorMessage = handleApiError(err);
                setError(errorMessage);
                setPets([]);
            } finally {
                setLoading(false);
            }
        },
        [filters, searchTerm]
    );

    // Handle search
    const handleSearch = () => {
        fetchPets({ page: 1 });
    };

    // Handle filter changes
    const handleFilterChange = (
        key: keyof RehomingFilters,
        value: string | number | undefined
    ) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);
        fetchPets(newFilters);
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        const newFilters = { ...filters, page: newPage };
        setFilters(newFilters);
        fetchPets(newFilters);
    };

    // Format price display
    const formatPrice = (
        price: number | null | undefined,
        adoptionType: string
    ) => {
        if (adoptionType === "free") return "Free";
        return price ? `₹${price.toLocaleString()}` : "Price on request";
    };

    // Initial load
    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Header */}
            <div className="border-b border-gray-700 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                    Find Your Perfect Companion
                                </h1>
                                <p className="text-gray-400 mt-1 text-sm sm:text-base">
                                    Discover amazing pets looking for their forever homes
                                </p>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <Button
                                        onClick={() => navigate("/rehoming/my-pets")}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                    >
                                        🐾 My Pets
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/rehoming/my-requests")}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                    >
                                        📋 My Requests
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/rehoming/pet-requests")}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                    >
                                        📥 Pet Requests
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/rehoming/transactions")}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                    >
                                        💳 Transactions
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/rehoming/create")}
                                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold px-4 sm:px-6"
                                    >
                                        <Heart className="w-4 h-4 mr-2" />
                                        List My Pet
                                    </Button>
                                </div>
                            </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search by name, breed, or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-10 bg-gray-800 border-gray-700 text-white w-full"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    onClick={handleSearch}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Search
                                </Button>
                                <Button
                                    onClick={() => setShowFilters(!showFilters)}
                                    variant="outline"
                                    className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                            </div>
                        </div>

                        {/* Filter Panel */}
                        {showFilters && (
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Species Filter */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                Species
                                            </label>
                                            <select
                                                value={filters.species || ""}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "species",
                                                        e.target.value || undefined
                                                    )
                                                }
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                            >
                                                <option value="">All Species</option>
                                                <option value="dog">Dogs</option>
                                                <option value="cat">Cats</option>
                                            </select>
                                        </div>

                                        {/* Adoption Type Filter */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                Adoption Type
                                            </label>
                                            <select
                                                value={filters.adoptionType || ""}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "adoptionType",
                                                        e.target.value || undefined
                                                    )
                                                }
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                            >
                                                <option value="">All Types</option>
                                                <option value="free">Free</option>
                                                <option value="paid">Paid</option>
                                            </select>
                                        </div>

                                        {/* Age Range */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                Min Age (years)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="30"
                                                value={filters.minAge || ""}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "minAge",
                                                        e.target.value
                                                            ? parseInt(e.target.value)
                                                            : undefined
                                                    )
                                                }
                                                className="bg-gray-800 border-gray-700 text-white"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                                Max Age (years)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="30"
                                                value={filters.maxAge || ""}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "maxAge",
                                                        e.target.value
                                                            ? parseInt(e.target.value)
                                                            : undefined
                                                    )
                                                }
                                                className="bg-gray-800 border-gray-700 text-white"
                                                placeholder="30"
                                            />
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            onClick={() => {
                                                setFilters({ page: 1, limit: 12 });
                                                setSearchTerm("");
                                                fetchPets({ page: 1, limit: 12 });
                                            }}
                                            variant="outline"
                                            className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Card
                                key={index}
                                className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
                            >
                                <CardContent className="p-0">
                                    <div className="aspect-square bg-gray-700 animate-pulse rounded-t-lg" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-700 rounded animate-pulse" />
                                        <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4" />
                                        <div className="flex gap-2">
                                            <div className="h-6 bg-gray-700 rounded animate-pulse w-16" />
                                            <div className="h-6 bg-gray-700 rounded animate-pulse w-20" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-red-900/20 via-red-800/20 to-red-900/20 max-w-md mx-auto">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Failed to Load Pets
                            </h3>
                            <p className="text-gray-300 mb-4">{error}</p>
                            <Button
                                onClick={() => fetchPets()}
                                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                            >
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!loading && !error && pets.length === 0 && (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 max-w-md mx-auto">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                                <Heart className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                No Pets Found
                            </h3>
                            <p className="text-gray-300 mb-4">
                                {searchTerm ||
                                Object.keys(filters).some(
                                    (key) =>
                                        filters[key as keyof RehomingFilters] !== undefined &&
                                        key !== "page" &&
                                        key !== "limit"
                                )
                                    ? "Try adjusting your search or filters"
                                    : "Be the first to list a pet for adoption!"}
                            </p>
                            <Button
                                onClick={() => navigate("/rehoming/create")}
                                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
                            >
                                <Heart className="w-4 h-4 mr-2" />
                                List My Pet
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pets Grid */}
                {!loading && !error && pets.length > 0 && (
                    <>
                        {/* Results Summary */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                            <p className="text-gray-400 text-sm">
                                Showing {pets.length} of {pagination.total} pets
                                {searchTerm && ` for "${searchTerm}"`}
                            </p>
                            <p className="text-gray-400 text-sm">
                                Page {pagination.page} of {pagination.totalPages}
                            </p>
                        </div>

                        {/* Pet Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                            {pets.map((pet) => (
                                <Card
                                    key={pet.id}
                                    className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                    onClick={() => navigate(`/rehoming/${pet.id}`)}
                                >
                                    <CardContent className="p-0">
                                        {/* Pet Image */}
                                        <div className="aspect-square relative overflow-hidden rounded-t-lg">
                                            {pet.imageUrls && pet.imageUrls.length > 0 ? (
                                                <img
                                                    src={
                                                        pet.imageUrls[0] ||
                                                        "https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?semt=ais_hybrid&w=740&q=80"
                                                    }
                                                    alt={pet.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src =
                                                            "https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?semt=ais_hybrid&w=740&q=80";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                                    {pet.species === "dog" ? (
                                                        <Dog className="w-16 h-16 text-gray-400" />
                                                    ) : (
                                                        <Cat className="w-16 h-16 text-gray-400" />
                                                    )}
                                                </div>
                                            )}

                                            {/* Verification Badge */}
                                            {pet.isVerified && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-green-900 text-green-200 border-green-700">
                                                        <Verified className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Adoption Type Badge */}
                                            <div className="absolute top-2 left-2">
                                                <Badge
                                                    className={
                                                        pet.adoptionType === "free"
                                                            ? "bg-blue-900 text-blue-200 border-blue-700"
                                                            : "bg-orange-900 text-orange-200 border-orange-700"
                                                    }
                                                >
                                                    {pet.adoptionType === "free" ? (
                                                        <>
                                                            <Heart className="w-3 h-3 mr-1" />
                                                            Free
                                                        </>
                                                    ) : (
                                                        <>
                                                            <DollarSign className="w-3 h-3 mr-1" />
                                                            Paid
                                                        </>
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Pet Details */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
                                                        {pet.name}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        {pet.breed} • {pet.age}{" "}
                                                        {pet.age === 1 ? "year" : "years"} old
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                                                {pet.description}
                                            </p>

                                            {/* Price and Owner */}
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm">
                                                    <span className="text-blue-400 font-semibold">
                                                        {formatPrice(pet.price, pet.adoptionType)}
                                                    </span>
                                                </div>

                                                {pet.owner && (
                                                    <div className="flex items-center gap-2">
                                                        <>
                                                            <Avatar className="w-6 h-6">
                                                                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                                                                    {pet.owner.name
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </div>
                                                            </Avatar>
                                                            <span className="text-gray-400 text-xs">
                                                                {pet.owner.name}
                                                            </span>
                                                        </>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex flex-wrap justify-center gap-2 overflow-x-auto">
                                <Button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    variant="outline"
                                    className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Previous
                                </Button>

                                {/* Page Numbers */}
                                {Array.from(
                                    { length: Math.min(5, pagination.totalPages) },
                                    (_, i) => {
                                        const pageNum = Math.max(
                                            1,
                                            Math.min(
                                                pagination.page - 2,
                                                pagination.totalPages - 4
                                            )
                                        ) + i;
                                        if (pageNum > pagination.totalPages) return null;

                                        return (
                                            <Button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                variant={
                                                    pageNum === pagination.page ? "default" : "outline"
                                                }
                                                className={
                                                    pageNum === pagination.page
                                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                        : "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                                                }
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    }
                                )}

                                <Button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    variant="outline"
                                    className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
            </div>
        </div>
    );
};

export default RehomingList;
