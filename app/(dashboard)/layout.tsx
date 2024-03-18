import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserButton } from "@/components/user-button";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
            <nav className="flex justify-between items-center border-b h-16 px-4 py-2">
                <Logo />
                <div className="flex gap-4 items-center">
                    <ThemeSwitcher />
                    <UserButton />
                </div>
            </nav>
            {children}
        </div>
    );
}
export default DashboardLayout;