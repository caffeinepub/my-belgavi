import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, ParkingCircle, Ticket, AlertCircle } from 'lucide-react';
import { paymentsData } from '../data/paymentsData';
import { Badge } from '@/components/ui/badge';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Digital Payments</h1>
        <p className="text-lg text-muted-foreground">
          Pay fines, parking fees, and book event tickets
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          <strong>Note:</strong> Payment gateway integration points are ready. Connect with UPI, card processors, or other payment services to enable live transactions.
        </p>
      </div>

      <Tabs defaultValue="fines">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="fines">Fines</TabsTrigger>
          <TabsTrigger value="parking">Parking</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="fines" className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Municipal Fines</h3>
          {paymentsData.fines.map((fine, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{fine.type}</h4>
                    <p className="text-sm text-muted-foreground mb-2">Date: {fine.date}</p>
                    <p className="text-2xl font-bold text-primary">₹{fine.amount}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={fine.status === 'paid' ? 'default' : 'destructive'} className="mb-3">
                      {fine.status}
                    </Badge>
                    {fine.status === 'pending' && (
                      <Button size="sm" className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="parking" className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Parking Fee Payment</h3>
          {paymentsData.parkingSessions.map((session, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ParkingCircle className="h-5 w-5" />
                      <h4 className="font-semibold">{session.location}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Duration: {session.duration}</p>
                    <p className="text-2xl font-bold text-primary">₹{session.fee}</p>
                  </div>
                  <Button size="sm" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pay ₹{session.fee}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tickets" className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Event Ticket Booking</h3>
          {paymentsData.events.map((event, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Ticket className="h-5 w-5" />
                      <h4 className="font-semibold">{event.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                    <p className="text-2xl font-bold text-primary">₹{event.ticketPrice}</p>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Ticket className="h-4 w-4" />
                    Book Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <div className="space-y-3">
            {paymentsData.transactionHistory.map((transaction, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{transaction.amount}</p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
