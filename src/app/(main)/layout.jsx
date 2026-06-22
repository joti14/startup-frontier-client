import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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