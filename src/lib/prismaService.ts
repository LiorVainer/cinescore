// src/lib/prismaService.ts
import {PrismaClient} from "@prisma/client";

export class PrismaService {
    constructor(public readonly client: PrismaClient) {
    }

    async disconnect() {
        await this.client.$disconnect();
    }
}
