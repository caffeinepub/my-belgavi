import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Briefcase, GraduationCap, Rocket, MapPin, Mail } from 'lucide-react';
import { useState } from 'react';
import { businessData } from '../data/businessData';

export default function BusinessPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businessData.businesses.filter((business) => {
    const matchesCategory = categoryFilter === 'all' || business.category === categoryFilter;
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Business & Jobs</h1>
        <p className="text-lg text-muted-foreground">
          Discover local businesses, job opportunities, and skill development programs
        </p>
      </div>

      <Tabs defaultValue="businesses">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="startup">Startup</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="internships">Internships</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBusinesses.map((business, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {business.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground capitalize">{business.category}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{business.description}</p>
                  <p className="text-sm text-muted-foreground">Contact: {business.contact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="startup" className="mt-6 space-y-4">
          {businessData.startupResources.map((resource, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  {resource.program}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contact: {resource.contact}</span>
                  <Button size="sm">Learn More</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="jobs" className="mt-6 space-y-4">
          {businessData.jobs.map((job, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {job.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{job.company} • {job.type}</p>
                  </div>
                  <Button size="sm">Apply</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{job.description}</p>
                <p className="text-sm text-muted-foreground">Contact: {job.contact}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="internships" className="mt-6 space-y-4">
          {businessData.internships.map((internship, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      {internship.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {internship.company} • {internship.duration}
                    </p>
                  </div>
                  <Button size="sm">Apply</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{internship.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessData.trainingCenters.map((center, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{center.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Courses Offered:</p>
                    <div className="flex flex-wrap gap-2">
                      {center.courses.map((course, i) => (
                        <span key={i} className="px-2 py-1 bg-muted rounded text-xs">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {center.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {center.contact}
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
