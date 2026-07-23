import type { media } from "@/domain/db/schema";

export interface MediaRepository {
  findById(id: string): Promise<typeof media.$inferSelect | undefined>;
  create(data: typeof media.$inferInsert): Promise<typeof media.$inferSelect>;
  update(
    id: string,
    data: Partial<typeof media.$inferInsert>,
  ): Promise<typeof media.$inferSelect>;
  delete(id: string): Promise<typeof media.$inferSelect>;
}
