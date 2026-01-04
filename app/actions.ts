"use server"

import { db } from "@/lib/db";
import { events, users, type NewEvent } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getRecentEvents() {
    return await db.query.events.findMany({
        orderBy: [desc(events.startTime)],
        limit: 50,
    });
}

export async function logEvent(data: NewEvent) {
    await db.insert(events).values(data);
    revalidatePath("/");
}

export async function getUser() {
    // For MVP we just get the first user or 'default-user' equivalent
    const allUsers = await db.select().from(users).limit(1);
    return allUsers[0];
}
