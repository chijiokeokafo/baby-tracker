import { getRecentEvents, getUser, logEvent } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRelativeTime } from "@/lib/utils";
import { ArrowRight, Moon, User as UserIcon } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const user = await getUser();
  const events = await getRecentEvents();

  // Simple logic to find last feed/sleep
  const lastFeed = events.find((e) => e.type === "FEED");
  const lastSleep = events.find((e) => e.type === "SLEEP");

  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans text-neutral-900">
      <div className="max-w-md mx-auto space-y-6">

        {/* Header / Status */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Baby Tracker</h1>
            <p className="text-neutral-500 text-sm">Welcome back, {user?.name ?? 'Parent'}</p>
          </div>
          <div className="h-10 w-10 bg-neutral-200 rounded-full flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-neutral-500" />
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">Last Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {lastFeed ? getRelativeTime(lastFeed.startTime) : "No feeds yet"}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">Last Sleep</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {lastSleep ? getRelativeTime(lastSleep.startTime) : "No sleep yet"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <Card className="border-none shadow-md overflow-hidden">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-neutral-100 p-1">
              <TabsTrigger
                value="feed"
                className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 h-full rounded-md text-base"
              >
                Feeding
              </TabsTrigger>
              <TabsTrigger
                value="sleep"
                className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 h-full rounded-md text-base"
              >
                Sleeping
              </TabsTrigger>
            </TabsList>

            <div className="p-6 bg-white min-h-[200px] flex flex-col justify-center">
              <TabsContent value="feed" className="mt-0 space-y-4">
                <form action={async () => {
                  "use server";
                  if (!user) return;
                  await logEvent({
                    userId: user.id,
                    type: "FEED",
                    startTime: new Date(),
                    metadata: JSON.stringify({ type: "BOTTLE", amount: 120 }), // Default for MVP quick log
                  });
                }}>
                  <Button size="lg" className="w-full h-20 text-xl bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-200" type="submit">
                    Log Feed Now
                  </Button>
                </form>
                <p className="text-center text-xs text-neutral-400">Default: Bottle, 120ml (Edit later)</p>
              </TabsContent>

              <TabsContent value="sleep" className="mt-0 space-y-4">
                <form action={async () => {
                  "use server";
                  if (!user) return;
                  await logEvent({
                    userId: user.id,
                    type: "SLEEP",
                    startTime: new Date(),
                    // For MVP, just logging start time as a point event for now, 
                    // or we assume it's "fell asleep". 
                    // Real app would toggle state.
                  });
                }}>
                  <Button size="lg" className="w-full h-20 text-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200" type="submit">
                    <Moon className="mr-2 h-6 w-6" /> Log Sleep
                  </Button>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Timeline */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Today's Timeline</h2>
          <ScrollArea className="h-[300px] rounded-md border p-4 bg-white shadow-sm border-neutral-100">
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-4 pb-4 border-b border-neutral-50 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 mt-2 rounded-full ${event.type === 'FEED' ? 'bg-orange-500' : 'bg-indigo-500'}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium text-neutral-900">
                        {event.type === 'FEED' ? 'Feeding' : 'Sleep'}
                      </p>
                      <span className="text-xs text-neutral-400">
                        {new Date(event.startTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {getRelativeTime(event.startTime)}
                    </p>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center py-10 text-neutral-400">
                  No events recorded yet today.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </main>
  );
}
