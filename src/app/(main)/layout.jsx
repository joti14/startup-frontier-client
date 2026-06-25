import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
    title: {
        template: "%s | Startup Frontier",
        default: "Startup Frontier — Where Great Teams Get Forged",
    },
    description: "Discover startups, browse open roles, and connect with founders building the next big thing.",
};

export default function MainLayout({ children }) {
    return (
        <div className="min-h-full">
            <header className="sticky top-0 z-50 w-full backdrop-blur-md">
                <Navbar />
            </header>
            <div>
                {children}
            </div>
            <Footer />
        </div>
    );
}