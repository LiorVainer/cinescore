// dal/triggers.dal.ts
import { PrismaClient, TriggerConditionType } from '@prisma/client';

export class TriggerDAL {
    constructor(private prisma: PrismaClient) {}

    async create(data: {
        userId: string;
        name: string;
        conditions: Array<{
            type: TriggerConditionType;
            stringValue?: string | null;
            numericValue?: number | null;
        }>;
    }) {
        return this.prisma.trigger.create({
            data: {
                userId: data.userId,
                name: data.name,
                conditions: {
                    create: data.conditions,
                },
            },
            include: { conditions: true },
        });
    }

    async findByUser(userId: string) {
        return this.prisma.trigger.findMany({
            where: { userId },
            include: { conditions: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(
        id: string,
        data: Partial<{
            name: string;
            conditions: Array<{
                type: TriggerConditionType;
                stringValue?: string | null;
                numericValue?: number | null;
            }>;
        }>,
    ) {
        // If conditions provided, replace them atomically
        const { conditions, ...triggerData } = data;

        return this.prisma.$transaction(async (tx) => {
            if (conditions) {
                // Delete existing conditions
                await tx.triggerCondition.deleteMany({ where: { triggerId: id } });
                // Create new conditions
                await tx.triggerCondition.createMany({
                    data: conditions.map((c) => ({ triggerId: id, ...c })),
                });
            }

            // Update trigger
            return tx.trigger.update({
                where: { id },
                data: triggerData,
                include: { conditions: true },
            });
        });
    }

    async delete(id: string) {
        // Conditions cascade automatically via DB
        return this.prisma.trigger.delete({ where: { id } });
    }

    async findAllWithConditions() {
        return this.prisma.trigger.findMany({
            include: {
                conditions: true,
                user: { select: { id: true, email: true } },
            },
        });
    }
}
