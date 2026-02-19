import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Zap, Trash2, Cloud, Sun, CloudRain } from 'lucide-react';
import { utilitiesData } from '../data/utilitiesData';

export default function UtilitiesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Smart Utilities Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Water supply, power alerts, garbage collection, and weather updates
        </p>
      </div>

      {/* Water Supply Schedule */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Droplets className="h-6 w-6 text-blue-600" />
          Water Supply Schedule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {utilitiesData.waterSchedule.map((schedule, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{schedule.zone}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{schedule.timing}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Power Cut Alerts */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-amber-600" />
          Power Cut Alerts
        </h2>
        <div className="space-y-4">
          {utilitiesData.powerAlerts.map((alert, index) => (
            <Card key={index} className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{alert.area}</h3>
                    <p className="text-sm text-muted-foreground">
                      {alert.date} | {alert.startTime} - {alert.endTime}
                    </p>
                  </div>
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Garbage Collection Schedule */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Trash2 className="h-6 w-6 text-green-600" />
          Garbage Collection Schedule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {utilitiesData.garbageSchedule.map((schedule, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{schedule.zone}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days:</span>
                  <span className="font-medium">{schedule.days}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{schedule.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Weather Updates */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Cloud className="h-6 w-6 text-sky-600" />
          Weather Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">{utilitiesData.weatherData.temperature}°C</p>
                  <p className="text-lg text-muted-foreground capitalize">{utilitiesData.weatherData.condition}</p>
                </div>
                {utilitiesData.weatherData.condition === 'sunny' && <Sun className="h-16 w-16 text-yellow-500" />}
                {utilitiesData.weatherData.condition === 'cloudy' && <Cloud className="h-16 w-16 text-gray-500" />}
                {utilitiesData.weatherData.condition === 'rainy' && <CloudRain className="h-16 w-16 text-blue-500" />}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {utilitiesData.weatherData.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{day.day}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground capitalize">{day.condition}</span>
                      <span className="font-semibold">{day.temp}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
