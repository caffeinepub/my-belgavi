import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintList from '../components/ComplaintList';
import { LogIn } from 'lucide-react';

export default function ComplaintsPage() {
  const { identity, login } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState('submit');

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Please login to submit and track complaints.
            </p>
            <Button onClick={login} className="gap-2">
              <LogIn className="h-4 w-4" />
              Login with Internet Identity
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Complaints & Grievances</h1>
        <p className="text-lg text-muted-foreground">
          Report civic issues and track their resolution
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="submit">Submit Complaint</TabsTrigger>
          <TabsTrigger value="track">Track Complaints</TabsTrigger>
        </TabsList>
        <TabsContent value="submit" className="mt-6">
          <ComplaintForm onSuccess={() => setActiveTab('track')} />
        </TabsContent>
        <TabsContent value="track" className="mt-6">
          <ComplaintList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
