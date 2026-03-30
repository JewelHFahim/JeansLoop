import { Loader } from "@/components/ui/loader";

export default function Loading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader variant="page" text="SYNCHRONIZING_COLLECTION" />
        </div>
    );
}
