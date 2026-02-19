import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Phone, Star } from 'lucide-react';
import { tourismData } from '../data/tourismData';

export default function TourismPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Explore Belgavi</h1>
        <p className="text-lg text-muted-foreground">
          Discover the rich heritage, culture, and hospitality of Belgavi
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">Top Attractions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tourismData.attractions.map((attraction, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={attraction.image}
                alt={attraction.name}
                className="w-full h-56 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/assets/generated/tourism-icon.dim_96x96.png';
                }}
              />
              <CardHeader>
                <CardTitle className="text-lg">{attraction.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{attraction.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{attraction.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Tabs defaultValue="hotels">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tourismData.hotels.map((hotel, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{hotel.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    {[...Array(hotel.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{hotel.address}</span>
                  </div>
                  <a
                    href={`tel:${hotel.phone}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {hotel.phone}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restaurants" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tourismData.restaurants.map((restaurant, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{restaurant.address}</span>
                  </div>
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {restaurant.phone}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="markets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tourismData.markets.map((market, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{market.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{market.location}</span>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Specialty:</span> {market.specialty}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <section>
        <h2 className="text-2xl font-bold mb-6">Historical Significance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tourismData.historicalSites.map((site, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{site.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{site.description}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Significance:</span> {site.significance}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
