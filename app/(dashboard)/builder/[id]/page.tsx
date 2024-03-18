import { GetFormById } from '@/actions/form';
import { FormBuilder } from '@/components/form-builder';

export const BuilderPage = async ({ params }: { params: { id: string } }) => {
    const { id } = params;

    if (!id) {
        throw new Error('Form id not provided');
    }

    const formId = Number(id);

    const form = await GetFormById(formId);

    if (!form) {
        throw new Error('Form not found');
    }

    return <FormBuilder form={form} />;
};

export default BuilderPage;
