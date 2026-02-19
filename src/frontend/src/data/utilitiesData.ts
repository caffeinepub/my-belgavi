export const utilitiesData = {
  waterSchedule: [
    { zone: 'Zone A (Camp Area)', timing: '6:00 AM - 8:00 AM' },
    { zone: 'Zone B (Tilakwadi)', timing: '7:00 AM - 9:00 AM' },
    { zone: 'Zone C (Hindalga)', timing: '8:00 AM - 10:00 AM' },
    { zone: 'Zone D (Khanapur Road)', timing: '6:30 AM - 8:30 AM' },
    { zone: 'Zone E (MG Road)', timing: '7:30 AM - 9:30 AM' },
    { zone: 'Zone F (Angol)', timing: '8:30 AM - 10:30 AM' },
  ],
  powerAlerts: [
    {
      area: 'Camp Area, Tilakwadi',
      date: 'Feb 20, 2026',
      startTime: '10:00 AM',
      endTime: '2:00 PM',
    },
    {
      area: 'Hindalga, Angol',
      date: 'Feb 21, 2026',
      startTime: '9:00 AM',
      endTime: '1:00 PM',
    },
    {
      area: 'MG Road, City Center',
      date: 'Feb 22, 2026',
      startTime: '11:00 AM',
      endTime: '3:00 PM',
    },
  ],
  garbageSchedule: [
    { zone: 'Zone A', days: 'Mon, Wed, Fri', time: '7:00 AM' },
    { zone: 'Zone B', days: 'Tue, Thu, Sat', time: '7:00 AM' },
    { zone: 'Zone C', days: 'Mon, Wed, Fri', time: '8:00 AM' },
    { zone: 'Zone D', days: 'Tue, Thu, Sat', time: '8:00 AM' },
    { zone: 'Zone E', days: 'Mon, Wed, Fri', time: '6:30 AM' },
    { zone: 'Zone F', days: 'Tue, Thu, Sat', time: '6:30 AM' },
  ],
  weatherData: {
    temperature: 28,
    condition: 'partly cloudy',
    forecast: [
      { day: 'Tomorrow', condition: 'sunny', temp: 30 },
      { day: 'Feb 21', condition: 'cloudy', temp: 27 },
      { day: 'Feb 22', condition: 'rainy', temp: 24 },
    ],
  },
};
