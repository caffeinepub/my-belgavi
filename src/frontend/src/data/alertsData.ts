export const alertsData = {
  currentAlerts: [
    {
      type: 'flood',
      severity: 'medium',
      message: 'Heavy rainfall expected in the next 6 hours. Low-lying areas may experience waterlogging.',
      timestamp: '2 hours ago',
    },
  ],
  aqiData: {
    value: 45,
    level: 'good',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
  },
  alertHistory: [
    {
      date: 'Feb 18, 2026',
      type: 'flood',
      severity: 'medium',
      message: 'Heavy rainfall expected. Stay alert.',
    },
    {
      date: 'Feb 17, 2026',
      type: 'power',
      severity: 'low',
      message: 'Scheduled power cut in Zone A from 10 AM to 2 PM.',
    },
    {
      date: 'Feb 16, 2026',
      type: 'water',
      severity: 'info',
      message: 'Water supply schedule updated for Zone B.',
    },
    {
      date: 'Feb 15, 2026',
      type: 'garbage',
      severity: 'info',
      message: 'Garbage collection delayed by 2 hours in Zone C.',
    },
    {
      date: 'Feb 14, 2026',
      type: 'weather',
      severity: 'low',
      message: 'Temperature expected to rise above 35°C today.',
    },
  ],
  preferenceOptions: [
    { alertType: 'flood', enabled: true },
    { alertType: 'power cut', enabled: true },
    { alertType: 'water supply', enabled: true },
    { alertType: 'garbage collection', enabled: false },
    { alertType: 'weather', enabled: true },
    { alertType: 'air quality', enabled: true },
  ],
};
