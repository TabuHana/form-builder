import { LoaderCircle } from "lucide-react";

const BuilderLoading = () => {
    return <div className='flex items-center justify-center w-full min-h-full'>
        <LoaderCircle className='animate-spin h-12 w-12' />
    </div>;
};
export default BuilderLoading;
