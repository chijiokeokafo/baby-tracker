import 'dotenv/config';
import { db } from '../lib/db';
import { users } from '../db/schema';

async function main() {
    console.log('Seeding database...');

    try {
        const insertedUsers = await db.insert(users).values({
            name: 'Parent',
        }).returning();

        console.log('Seeded users:', insertedUsers);
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
}

main();
