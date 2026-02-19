import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserComplaints } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import ComplaintRating from './ComplaintRating';
import ComplaintMap from './ComplaintMap';
import { ComplaintStatus } from '../backend';
import { MapPin, Calendar, Hash, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function ComplaintList() {
  const { data: complaints, isLoading } = useUserComplaints();
  const [filter, setFilter] = useState<'all' | ComplaintStatus>('all');
  const [statusChanges, setStatusChanges] = useState<Set<string>>(new Set());

  const filteredComplaints = complaints?.filter((c) => filter === 'all' || c.status === filter) || [];

  // Track status changes for visual indicators
  useEffect(() => {
    if (!complaints) return;

    const newChanges = new Set<string>();
    complaints.forEach((complaint) => {
      const key = `${complaint.id}-${complaint.status}`;
      if (!statusChanges.has(key) && statusChanges.size > 0) {
        newChanges.add(complaint.id);
      }
    });

    if (newChanges.size > 0) {
      setStatusChanges(newChanges);
      setTimeout(() => setStatusChanges(new Set()), 3000);
    }
  }, [complaints]);

  const getStatusBadge = (status: ComplaintStatus, complaintId: string) => {
    const hasChanged = statusChanges.has(complaintId);
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      inProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    };
    const labels = {
      pending: 'Pending',
      inProgress: 'In Progress',
      resolved: 'Resolved',
    };
    return (
      <Badge className={`${variants[status]} ${hasChanged ? 'animate-pulse' : ''}`}>
        {labels[status]}
        {hasChanged && <span className="ml-1">🔔</span>}
      </Badge>
    );
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.pending:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case ComplaintStatus.inProgress:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case ComplaintStatus.resolved:
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }
  };

  const renderStatusTimeline = (status: ComplaintStatus) => {
    const steps = [
      { key: ComplaintStatus.pending, label: 'Pending' },
      { key: ComplaintStatus.inProgress, label: 'In Progress' },
      { key: ComplaintStatus.resolved, label: 'Resolved' },
    ];

    const currentIndex = steps.findIndex((s) => s.key === status);

    return (
      <div className="flex items-center gap-2 mt-4">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentIndex ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1 text-center">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 ${
                  index < currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredComplaints.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No complaints found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg capitalize">{complaint.category}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {complaint.id}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {complaint.location}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(complaint.status, complaint.id)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{complaint.description}</p>

                {/* Status Timeline */}
                {renderStatusTimeline(complaint.status)}

                {/* GPS Location Map */}
                {complaint.latitude !== undefined && complaint.longitude !== undefined && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Complaint Location
                    </h4>
                    <ComplaintMap
                      latitude={complaint.latitude}
                      longitude={complaint.longitude}
                    />
                  </div>
                )}
                
                {complaint.photoUrl && (
                  <img
                    src={complaint.photoUrl}
                    alt="Complaint"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                )}

                {complaint.status === ComplaintStatus.resolved && (
                  <ComplaintRating complaint={complaint} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
