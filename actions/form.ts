'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { formSchema, formSchemaType } from '@/schemas/form';

export async function GetFormStats() {
    const stats = await db.form.aggregate({
        _sum: {
            visits: true,
            submissions: true,
        },
    });

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submissions || 0;

    let submissionRate = 0;

    if (visits > 0) {
        submissionRate = (submissions / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    return {
        visits,
        submissions,
        submissionRate,
        bounceRate,
    };
}

export async function CreateForm(data: formSchemaType) {
    const validatedFields = formSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error('form not valid');
    }

    const { name, description } = validatedFields.data;

    const form = await db.form.create({
        data: {
            name,
            description,
        },
    });

    if (!form) {
        throw new Error('form not created');
    }

    revalidatePath('/');
    return form.id;
}

export async function GetForms() {
    return await db.form.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
}

export async function GetFormById(id: number) {
    if (!id) {
        return null;
    }

    const form = await db.form.findUnique({
        where: {
            id,
        },
    });

    return form;
}

export async function UpdateFormContent(id: number, jsonContent: string) {
    if (!id || !jsonContent) {
        return null;
    }

    return await prisma?.form.update({
        where: {
            id,
        },
        data: {
            content: jsonContent,
        },
    });
}

export async function PublishForm(id: number) {
    if (!id) {
        return null;
    }

    return await db.form.update({
        where: { id },
        data: { published: true },
    });
}

export async function GetFormContentByUrl(formUrl: string) {
    if (!formUrl) {
        return null;
    }

    return await db.form.update({
        where: {
            shareUrl: formUrl,
        },
        data: {
            visits: {
                increment: 1,
            },
        },
        select: {
            content: true,
        },
    });
}

export async function SubmitForm(formUrl: string, content: string) {
    if (!formUrl || !content) {
        return null;
    }

    return await db.form.update({
        data: {
            submissions: {
                increment: 1,
            },
            FormSubmissions: {
                create: {
                    content,
                },
            },
        },
        where: {
            shareUrl: formUrl,
            published: true,
        },
    });
}

export async function GetFormWithSubmissions(id: number) {
    if (!id) {
        return null;
    }

    return await db.form.findUnique({
        where: {
            id,
        },
        include: {
            FormSubmissions: true,
        },
    });
}
