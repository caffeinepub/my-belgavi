export const paymentsData = {
  fines: [
    { type: 'Traffic Violation - Parking', amount: 500, date: 'Feb 15, 2026', status: 'pending' },
    { type: 'Property Tax Late Fee', amount: 1200, date: 'Feb 10, 2026', status: 'pending' },
    { type: 'Traffic Violation - Signal Jump', amount: 1000, date: 'Jan 28, 2026', status: 'paid' },
  ],
  parkingSessions: [
    { location: 'MG Road Parking', duration: '2 hours', fee: 40 },
    { location: 'Railway Station Parking', duration: '4 hours', fee: 80 },
    { location: 'City Mall Parking', duration: '3 hours', fee: 60 },
  ],
  events: [
    { name: 'Belgavi Utsav 2026', date: 'March 15-17, 2026', ticketPrice: 200 },
    { name: 'Classical Music Concert', date: 'March 5, 2026', ticketPrice: 300 },
    { name: 'Food Festival', date: 'Feb 28, 2026', ticketPrice: 150 },
  ],
  transactionHistory: [
    { date: 'Feb 18, 2026', type: 'Water Bill Payment', amount: 450, status: 'completed' },
    { date: 'Feb 15, 2026', type: 'Parking Fee', amount: 40, status: 'completed' },
    { date: 'Feb 10, 2026', type: 'Event Ticket', amount: 200, status: 'completed' },
    { date: 'Feb 5, 2026', type: 'Property Tax', amount: 5000, status: 'completed' },
    { date: 'Jan 28, 2026', type: 'Traffic Fine', amount: 1000, status: 'completed' },
  ],
};
