// dal/interests.dal.ts
import {PrismaClient, InterestType} from "@prisma/client";

export class InterestDAL {
    constructor(private prisma: PrismaClient) {
    }

    async create(data: {
        userId: string;
        name: string;
        conditions: Array<{
            type: InterestType;
            stringValue?: string | null;
            numericValue?: number | null;
        }>;
    }) {
        return this.prisma.interest.create({
            data: {
                userId: data.userId,
                name: data.name,
                conditions: {
                    create: data.conditions
                }
            },
            include: {conditions: true}
        });
    }

    async findByUser(userId: string) {
        return this.prisma.interest.findMany({
            where: {userId},
            include: {conditions: true},
            orderBy: {createdAt: 'desc'}
        });
    }

    async update(id: string, data: Partial<{
        name: string;
        conditions: Array<{
            type: InterestType;
            stringValue?: string | null;
            numericValue?: number | null;
        }>;
    }>) {
        // If conditions provided, replace them atomically
        const {conditions, ...interestData} = data;

        return this.prisma.$transaction(async (tx) => {
            if (conditions) {
                // Delete existing conditions
                await tx.interestCondition.deleteMany({where: {interestId: id}});
                // Create new conditions
                await tx.interestCondition.createMany({
                    data: conditions.map(c => ({interestId: id, ...c}))
                });
            }

            // Update interest
            return tx.interest.update({
                where: {id},
                data: interestData,
                include: {conditions: true}
            });
        });
    }

    async delete(id: string) {
        // Conditions cascade automatically via DB
        return this.prisma.interest.delete({where: {id}});
    }

    async findAllWithConditions() {
        return this.prisma.interest.findMany({
            include: {
                conditions: true,
                user: {select: {id: true, email: true}}
            }
        });
    }
}
