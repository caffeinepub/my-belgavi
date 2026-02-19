import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Droplets, Wind, Zap, Trash2 } from 'lucide-react';
import { alertsData } from '../data/alertsData';

export default function AlertsPage() {
  const getAQIColor = (value: number) => {
    if (value <= 50) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (value <= 100) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    if (value <= 150) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  const getAQILabel = (value: number) => {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 150) return 'Poor';
    return 'Severe';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Smart Alerts</h1>
        <p className="text-lg text-muted-foreground">
          Stay informed about weather, air quality, and utility updates
        </p>
      </div>

      {/* Current Alerts */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Current Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flood Alert */}
          <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-amber-600" />
                Flood Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertsData.currentAlerts
                  .filter((alert) => alert.type === 'flood')
                  .map((alert, index) => (
                    <div key={index}>
                      <Badge className={getSeverityColor(alert.severity)} variant="outline">
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <p className="text-sm mt-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Air Quality Index */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Air Quality Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold">{alertsData.aqiData.value}</div>
                <Badge className={getAQIColor(alertsData.aqiData.value)} variant="outline">
                  {getAQILabel(alertsData.aqiData.value)}
                </Badge>
                <p className="text-sm text-muted-foreground">{alertsData.aqiData.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Alert History */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Alert History</h2>
        <div className="space-y-3">
          {alertsData.alertHistory.map((alert, index) => {
            const Icon =
              alert.type === 'flood'
                ? Droplets
                : alert.type === 'power'
                ? Zap
                : alert.type === 'water'
                ? Droplets
                : alert.type === 'garbage'
                ? Trash2
                : AlertTriangle;

            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium capitalize">{alert.type} Alert</span>
                          <Badge className={getSeverityColor(alert.severity)} variant="outline">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {alert.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Notification Preferences */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Configure which alerts you want to receive. Push notification infrastructure integration point ready.
              </p>
              {alertsData.preferenceOptions.map((option, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <Label htmlFor={`alert-${index}`} className="flex-1 cursor-pointer">
                    <span className="font-medium capitalize">{option.alertType} Alerts</span>
                  </Label>
                  <Switch id={`alert-${index}`} defaultChecked={option.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
