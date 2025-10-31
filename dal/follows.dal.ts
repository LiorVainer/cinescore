// dal/follows.dal.ts
import { PrismaClient, FollowType } from '@prisma/client';

export class FollowDAL {
    constructor(private prisma: PrismaClient) {}

    async create(userId: string, type: FollowType, value: string) {
        return this.prisma.follow.create({
            data: { userId, type, value },
        });
    }

    async findByUser(userId: string) {
        return this.prisma.follow.findMany({
            where: { userId },
            orderBy: [{ type: 'asc' }, { value: 'asc' }],
        });
    }

    async findUnique(userId: string, type: FollowType, value: string) {
        return this.prisma.follow.findUnique({
            where: { userId_type_value: { userId, type, value } },
        });
    }

    async delete(id: string) {
        return this.prisma.follow.delete({ where: { id } });
    }
}
