import { getRecentEvents, getUser } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { FeedForm } from "@/components/feed-form";
import { SleepForm } from "@/components/sleep-form";
import { DiaperForm } from "@/components/diaper-form";
import { getRelativeTime } from "@/lib/utils";
import { Moon, Utensils, Droplets, Baby } from "lucide-react";

export default async function Home() {
  const user = await getUser();
  const events = await getRecentEvents();

  const lastFeed = events.find((e) => e.type === "FEED");
  const lastSleep = events.find((e) => e.type === "SLEEP");
  const lastDiaper = events.find((e) => e.type === "DIAPER");

  return (
    <main className="min-h-screen bg-background">
      <div className="px-4 py-6 sm:px-6 md:px-8">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Baby Tracker</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.name ?? "Parent"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="h-9 w-9 bg-muted rounded-full flex items-center justify-center">
                <Baby className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Last Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-lg font-bold text-feed truncate">
                  {lastFeed ? getRelativeTime(lastFeed.startTime) : "---"}
                </p>
                {lastFeed && (
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(lastFeed.startTime!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </CardContent>
              <div className="h-1 bg-feed/20">
                <div className="h-full bg-feed w-full" />
              </div>
            </Card>

            <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Last Sleep
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-lg font-bold text-sleep truncate">
                  {lastSleep ? getRelativeTime(lastSleep.startTime) : "---"}
                </p>
                {lastSleep && (
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(lastSleep.startTime!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </CardContent>
              <div className="h-1 bg-sleep/20">
                <div className="h-full bg-sleep w-full" />
              </div>
            </Card>

            <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Last Diaper
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-lg font-bold text-diaper truncate">
                  {lastDiaper ? getRelativeTime(lastDiaper.startTime) : "---"}
                </p>
                {lastDiaper && (
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(lastDiaper.startTime!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </CardContent>
              <div className="h-1 bg-diaper/20">
                <div className="h-full bg-diaper w-full" />
              </div>
            </Card>
          </div>

          {/* Main Actions */}
          <Card className="border-border/50 shadow-md overflow-hidden">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 rounded-none p-0">
                <TabsTrigger
                  value="feed"
                  className="data-[state=active]:bg-feed-muted data-[state=active]:text-feed rounded-none h-full text-sm font-medium border-b-2 border-transparent data-[state=active]:border-feed transition-colors"
                >
                  <Utensils className="h-4 w-4 mr-1.5" />
                  Feed
                </TabsTrigger>
                <TabsTrigger
                  value="sleep"
                  className="data-[state=active]:bg-sleep-muted data-[state=active]:text-sleep rounded-none h-full text-sm font-medium border-b-2 border-transparent data-[state=active]:border-sleep transition-colors"
                >
                  <Moon className="h-4 w-4 mr-1.5" />
                  Sleep
                </TabsTrigger>
                <TabsTrigger
                  value="diaper"
                  className="data-[state=active]:bg-diaper-muted data-[state=active]:text-diaper rounded-none h-full text-sm font-medium border-b-2 border-transparent data-[state=active]:border-diaper transition-colors"
                >
                  <Droplets className="h-4 w-4 mr-1.5" />
                  Diaper
                </TabsTrigger>
              </TabsList>

              <div className="p-5 bg-card">
                <TabsContent value="feed" className="mt-0">
                  <FeedForm userId={user?.id} />
                </TabsContent>

                <TabsContent value="sleep" className="mt-0">
                  <SleepForm userId={user?.id} />
                </TabsContent>

                <TabsContent value="diaper" className="mt-0">
                  <DiaperForm userId={user?.id} />
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          {/* Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <span className="text-xs text-muted-foreground">
                {events.length} events
              </span>
            </div>

            <ScrollArea className="h-[280px] rounded-xl border border-border/50 bg-card shadow-sm">
              <div className="p-3">
                {events.length > 0 ? (
                  <div className="space-y-1">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                            event.type === "FEED"
                              ? "bg-feed-muted text-feed"
                              : event.type === "SLEEP"
                              ? "bg-sleep-muted text-sleep"
                              : "bg-diaper-muted text-diaper"
                          }`}
                        >
                          {event.type === "FEED" && <Utensils className="h-4 w-4" />}
                          {event.type === "SLEEP" && <Moon className="h-4 w-4" />}
                          {event.type === "DIAPER" && <Droplets className="h-4 w-4" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {event.type === "FEED"
                                ? "Feeding"
                                : event.type === "SLEEP"
                                ? "Sleep"
                                : "Diaper"}
                            </p>
                            {event.type === "FEED" &&
                              (event.metadata as { amount?: number } | null)?.amount != null && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                  {(event.metadata as { amount: number }).amount}ml
                                </Badge>
                              )}
                            {event.type === "DIAPER" &&
                              (event.metadata as { type?: string } | null)?.type && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                  {(event.metadata as { type: string }).type}
                                </Badge>
                              )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getRelativeTime(event.startTime)}
                          </p>
                        </div>

                        {/* Time */}
                        <time className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                          {new Date(event.startTime!).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Baby className="h-12 w-12 mb-3 opacity-20" />
                    <p className="font-medium">No events yet</p>
                    <p className="text-sm">Start tracking above!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </main>
  );
}
