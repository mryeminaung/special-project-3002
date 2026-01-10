import { useNavigate, useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { Loader2, Shield } from "lucide-react";

import RootLayout from "@/layouts/RootLayout";
import type { UsersData } from "@/types";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";

// Demo data - in production, this would come from an API
const demoSupervisorData: UsersData[] = [
  {
    id: 1,
    name: "Dr. John Smith",
    email: "john.smith@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Professor",
    departmentName: "Computer Science",
    phoneNumber: "+95 9 123 456 789",
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Associate Professor",
    departmentName: "Information Technology",
    phoneNumber: "+95 9 234 567 890",
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    email: "michael.chen@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Professor",
    departmentName: "Software Engineering",
    phoneNumber: "+95 9 345 678 901",
  },
  {
    id: 4,
    name: "Dr. Emily Davis",
    email: "emily.davis@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Lecturer",
    departmentName: "Computer Science",
    phoneNumber: "+95 9 456 789 012",
  },
  {
    id: 5,
    name: "Dr. Robert Wilson",
    email: "robert.wilson@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Associate Professor",
    departmentName: "Information Technology",
    phoneNumber: "+95 9 567 890 123",
  },
  {
    id: 6,
    name: "Dr. Lisa Anderson",
    email: "lisa.anderson@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Assistant Lecturer",
    departmentName: "Software Engineering",
    phoneNumber: "+95 9 678 901 234",
  },
  {
    id: 7,
    name: "Dr. David Brown",
    email: "david.brown@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Professor",
    departmentName: "Computer Science",
    phoneNumber: "+95 9 789 012 345",
  },
  {
    id: 8,
    name: "Dr. Jennifer Martinez",
    email: "jennifer.martinez@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Lecturer",
    departmentName: "Information Technology",
    phoneNumber: "+95 9 890 123 456",
  },
  {
    id: 9,
    name: "Dr. James Taylor",
    email: "james.taylor@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Associate Professor",
    departmentName: "Software Engineering",
    phoneNumber: "+95 9 901 234 567",
  },
  {
    id: 10,
    name: "Dr. Maria Garcia",
    email: "maria.garcia@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Tutor",
    departmentName: "Computer Science",
    phoneNumber: "+95 9 012 345 678",
  },
  {
    id: 11,
    name: "Dr. William Lee",
    email: "william.lee@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Professor",
    departmentName: "Information Technology",
    phoneNumber: "+95 9 123 456 789",
  },
  {
    id: 12,
    name: "Dr. Patricia White",
    email: "patricia.white@miit.edu.mm",
    role: "Supervisor",
    status: "Active",
    rank: "Lecturer",
    departmentName: "Software Engineering",
    phoneNumber: "+95 9 234 567 890",
  },
];

export default function SupervisorDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [supervisor, setSupervisor] = useState<UsersData | null>(null);

  useEffect(() => {
    // In production, fetch from API: api.get(`/supervisors/${id}`)
    const foundSupervisor = demoSupervisorData.find(
      (s) => s.id === Number(id),
    );
    setSupervisor(foundSupervisor || null);
  }, [id]);

  return (
    <RootLayout>
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Button
            onClick={() => navigate("/supervisors")}
            variant="ghost"
            className="mb-8 flex items-center gap-2 rounded-lg  px-4 py-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Supervisors
          </Button>

          {!supervisor ? (
            <Loading message="supervisor data" />
          ) : (
            <>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600/50 dark:bg-primary-900">
                  <Shield className="h-6 w-6 text-primary-800 dark:text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold leading-tight">
                    Supervisor Profile
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    View supervisor information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Info Card */}
                <Card className="lg:col-span-2 rounded-2xl border border-neutral-200 shadow-sm dark:border-neutral-800">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-10">
                      {/* Name */}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Full Name
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {supervisor.name}
                        </p>
                      </div>

                      {/* Rank */}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Rank
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {supervisor.rank}
                        </p>
                      </div>

                      {/* Email */}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Email Address
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-base">
                          <EnvelopeIcon className="h-4 w-4 text-muted-foreground" />
                          {supervisor.email}
                        </p>
                      </div>

                      {/* Phone */}
                      {supervisor.phoneNumber && (
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Phone Number
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-base">
                            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                            {supervisor.phoneNumber}
                          </p>
                        </div>
                      )}

                      {/* Department */}
                      {supervisor.departmentName && (
                        <div className="sm:col-span-2">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Department
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            {supervisor.departmentName}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Side Panel (Optional Future Use) */}
                <div className="hidden lg:block">
                  <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-sm text-muted-foreground dark:border-neutral-700">
                    testing
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </RootLayout>

  );
}

