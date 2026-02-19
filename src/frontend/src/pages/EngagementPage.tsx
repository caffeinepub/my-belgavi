import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Newspaper, Users, Vote, MessageSquare } from 'lucide-react';
import { engagementData } from '../data/engagementData';

export default function EngagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Citizen Engagement</h1>
        <p className="text-lg text-muted-foreground">
          Participate in polls, stay informed, and connect with your community
        </p>
      </div>

      <Tabs defaultValue="polls">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="polls">Polls</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
          <TabsTrigger value="forum">Forum</TabsTrigger>
        </TabsList>

        <TabsContent value="polls" className="mt-6 space-y-4">
          {engagementData.polls.map((poll, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5" />
                  {poll.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {poll.options.map((option, i) => {
                  const percentage = (option.votes / poll.totalVotes) * 100;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{option.text}</span>
                        <span className="text-muted-foreground">{option.votes} votes</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="events" className="mt-6 space-y-4">
          {engagementData.events.map((event, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {event.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.date} | {event.location}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="news" className="mt-6 space-y-4">
          {engagementData.news.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5" />
                  {item.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{item.summary}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="volunteer" className="mt-6 space-y-4">
          {engagementData.volunteers.map((opportunity, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {opportunity.position}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{opportunity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contact: {opportunity.contact}</span>
                  <Button size="sm">Apply</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="forum" className="mt-6 space-y-4">
          {engagementData.forumThreads.map((thread, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {thread.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      by {thread.author} • {thread.replies} replies • {thread.lastActivity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
