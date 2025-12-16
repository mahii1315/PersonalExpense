"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
});

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
    const result = RegisterSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid input" };
    }

    const { email, password, name } = result.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        return { success: true, user };
    } catch (err) {
        console.error(err);
        return { error: `Error: ${(err as Error).message}` };
    }
}
