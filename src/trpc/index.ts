import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession();
        const user = getUser();

        if (!user.id || !user.email) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }

        const dbUser = await db.user.findFirst({
            where: { userKindeId: user.id },
        })

        if (!dbUser) {
            await db.user.create({
                data: {
                    userKindeId: user.id,
                    email: user.email,
                }
            });
        }

        return { success: true }
    }),
    getUserFiles: privateProcedure.query(async ({ ctx }) => {
        const { userKindeId } = ctx;

        return await db.file.findMany({
            where: { userId: userKindeId },
        });
    })
});

export type AppRouter = typeof appRouter;