import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, MessageSquare, Video, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

// Mock appointments data (replace with actual API call)
const mockAppointments = [
  {
    id: "1",
    vet: {
      id: "vet1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@vetclinic.com",
      phone: "9876543210",
      specialization: ["General Practice", "Surgery"],
      profilePicture: "",
    },
    pet: {
      id: "pet1",
      name: "Buddy",
      species: "dog",
      breed: "Golden Retriever",
      age: 3,
    },
    appointmentDate: "2024-02-15",
    startTime: "14:00",
    endTime: "14:30",
    consultationType: "telemedicine" as const,
    reason: "Annual checkup and vaccination",
    notes: "Pet has mild allergies to certain foods",
    status: "confirmed",
    createdAt: "2024-01-20T10:00:00.000Z",
  },
  {
    id: "2",
    vet: {
      id: "vet2",
      name: "Dr. Michael Chen",
      email: "michael.chen@vetclinic.com",
      phone: "9876543211",
      specialization: ["Dermatology", "Allergy"],
      profilePicture: "",
    },
    pet: {
      id: "pet2",
      name: "Luna",
      species: "cat",
      breed: "Persian",
      age: 2,
    },
    appointmentDate: "2024-02-10",
    startTime: "10:00",
    endTime: "10:45",
    consultationType: "in_clinic" as const,
    reason: "Skin condition examination",
    notes: "",
    status: "completed",
    createdAt: "2024-01-18T15:30:00.000Z",
  },
  {
    id: "3",
    vet: {
      id: "vet3",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@vetclinic.com",
      phone: "9876543212",
      specialization: ["Emergency Medicine", "Surgery"],
      profilePicture: "",
    },
    pet: {
      id: "pet1",
      name: "Buddy",
      species: "dog",
      breed: "Golden Retriever",
      age: 3,
    },
    appointmentDate: "2024-01-25",
    startTime: "16:00",
    endTime: "16:45",
    consultationType: "in_clinic" as const,
    reason: "Emergency visit - limping",
    notes: "Dog has been limping since yesterday morning",
    status: "completed",
    createdAt: "2024-01-15T09:45:00.000Z",
  },
];

const MyAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments] = useState(mockAppointments);
  const [loading] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");

  // Filter appointments based on status and date
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    const isUpcoming = appointmentDate >= today && appointment.status !== "completed" && appointment.status !== "cancelled";
    
    switch (filter) {
      case "upcoming":
        return isUpcoming;
      case "completed":
        return appointment.status === "completed";
      case "cancelled":
        return appointment.status === "cancelled";
      default:
        return true;
    }
  });

  // Sort appointments by date (upcoming first, then by date)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.appointmentDate}T${a.startTime}`);
    const dateB = new Date(`${b.appointmentDate}T${b.startTime}`);
    return dateB.getTime() - dateA.getTime(); // Most recent first
  });

  // Get status badge color
  const getStatusBadge = (status: string, appointmentDate: string) => {
    const date = new Date(appointmentDate);
    const today = new Date();
    const isUpcoming = date >= today;

    if (status === "completed") {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
    if (status === "cancelled") {
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    }
    if (isUpcoming) {
      return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Past</Badge>;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">My Appointments</h1>
              <p className="text-gray-400">Manage your veterinary appointments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Filter Tabs */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { key: "all", label: "All" },
              { key: "upcoming", label: "Upcoming" },
              { key: "completed", label: "Completed" },
              { key: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <Button
            key={tab.key}
            variant={filter === tab.key ? "default" : "ghost"}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-6 py-2 rounded-full font-medium transition-all
              ${filter === tab.key
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"}
            `}
              >
            {tab.label}
            <Badge
              variant="secondary"
              className={`ml-2 px-2 py-0.5 rounded-full text-xs
                ${filter === tab.key
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-700 text-gray-300"}
              `}
            >
              {tab.key === "all"
                ? appointments.length
                : tab.key === "upcoming"
                ? appointments.filter(a => {
                const date = new Date(a.appointmentDate);
                const today = new Date();
                return date >= today && a.status !== "completed" && a.status !== "cancelled";
                  }).length
                : appointments.filter(a => a.status === tab.key).length}
            </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Book New Appointment Button */}
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:items-center mb-2">
          <h2 className="text-xl font-semibold text-white text-center md:text-left">
            {filter === "all" ? "All Appointments" : 
             filter === "upcoming" ? "Upcoming Appointments" :
             filter === "completed" ? "Completed Appointments" :
             "Cancelled Appointments"} ({sortedAppointments.length})
          </h2>
          <Button
            onClick={() => navigate("/vets")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 w-full md:w-auto"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book New Appointment
          </Button>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedAppointments.length === 0 ? (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === "all" ? "No Appointments Yet" :
                 filter === "upcoming" ? "No Upcoming Appointments" :
                 filter === "completed" ? "No Completed Appointments" :
                 "No Cancelled Appointments"}
              </h3>
              <p className="text-gray-300 mb-6">
                {filter === "all" || filter === "upcoming" 
                  ? "Book your first appointment with our veterinarians."
                  : `You don't have any ${filter} appointments.`}
              </p>
              {(filter === "all" || filter === "upcoming") && (
                <Button
                  onClick={() => navigate("/vets")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Your First Appointment
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sortedAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          {appointment.vet.profilePicture ? (
                            <img
                              src={appointment.vet.profilePicture}
                              alt={appointment.vet.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-700 to-indigo-800 flex items-center justify-center text-white font-bold">
                              {appointment.vet.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{appointment.vet.name}</h3>
                          <p className="text-sm text-gray-300">{appointment.vet.specialization.join(", ")}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-300">{appointment.pet.name} ({appointment.pet.species})</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status, appointment.appointmentDate)}
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Date</p>
                          <p className="text-sm text-gray-300">{formatDate(appointment.appointmentDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Time</p>
                          <p className="text-sm text-gray-300">
                            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.consultationType === "telemedicine" ? (
                          <Video className="w-4 h-4 text-green-400" />
                        ) : (
                          <MapPin className="w-4 h-4 text-orange-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">Type</p>
                          <p className="text-sm text-gray-300 capitalize">
                            {appointment.consultationType.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reason and Notes */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-white">Reason for Visit</p>
                          <p className="text-sm text-gray-300">{appointment.reason}</p>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-indigo-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-white">Additional Notes</p>
                            <p className="text-sm text-gray-300">{appointment.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Vet Contact */}
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 pt-2 border-t border-gray-700">
                        <a
                            href={`tel:${appointment.vet.phone}`}
                            className="flex items-center gap-2 hover:underline focus:outline-none"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-300">{appointment.vet.phone}</span>
                        </a>
                        <a
                            href={`mailto:${appointment.vet.email}`}
                            className="flex items-center gap-2 hover:underline focus:outline-none"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-300">{appointment.vet.email}</span>
                        </a>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700 mt-4 justify-end">
                      {appointment.status === "confirmed" && new Date(appointment.appointmentDate) >= new Date() && (
                        <>
                          {appointment.consultationType === "telemedicine" && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md flex items-center gap-2"
                            >
                              <Video className="w-4 h-4" />
                              <span>Join Call</span>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                      >
                        View Details
                      </Button>
                    </div>
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

export default MyAppointments;
