import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull().references(() => users.id),
    type: text('type').notNull(), // 'FEED' | 'SLEEP'
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    metadata: jsonb('metadata'), // JSON string since SQLite doesn't strictly enforce JSON type, but we can parse it.
    createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
