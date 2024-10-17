import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Toaster } from "@/components/ui/toaster"

export default function DemoLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <AdminPanelLayout>{children}
        <Toaster />
    </AdminPanelLayout>;
}