"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    Sun,
    Moon,
    Menu,
    X,
    LayoutDashboard,
    User,
    LogOut,
    Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, useSession } from "@/lib/auth-client";
import { Logo } from "@/components/Logo";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    const navigationLinks = [
        { name: "Home", href: "/" },
        { name: "Browse Startups", href: "/startups" },
        { name: "Opportunities", href: "/opportunities" },
    ];

    return (
        <div className="w-full px-4 pt-4 sm:px-6 lg:px-8 bg-transparent">
            <nav className="mx-auto max-w-7xl rounded-full border border-slate-200/60 bg-white/80 px-6 backdrop-blur-xl transition-all dark:border-slate-800/50 dark:bg-slate-950/80 shadow-[0_2px_20px_-4px_rgba(0,0,0,0,04)]">
                <div className="flex h-14 items-center justify-between">

                    {/* Left Side: Brand Logo */}
                    <div className="flex items-center">
                        <Logo />
                    </div>

                    {/* Center Side: Clean Text Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navigationLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-[13px] font-medium tracking-wide transition-colors relative py-1 ${isActive
                                            ? "text-slate-950 dark:text-white font-semibold"
                                            : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-950 dark:bg-white rounded-full animate-in fade-in zoom-in duration-300" />
                                    )}
                                </Link>
                            );
                        })}
                        {session?.user && (
                            <Link
                                href={`/dashboard/${session.user.role}`}
                                className={`text-[13px] font-medium tracking-wide transition-colors relative py-1 ${pathname.startsWith("/dashboard")
                                        ? "text-slate-950 dark:text-white font-semibold"
                                        : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                                    }`}
                            >
                                Dashboard
                                {pathname.startsWith("/dashboard") && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-950 dark:bg-white rounded-full animate-in fade-in zoom-in duration-300" />
                                )}
                            </Link>
                        )}
                    </div>

                    {/* Right Side: Trendy Rounded Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {mounted ? (
                            <>
                                {/* Minimal Theme Toggle */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-8 w-8 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                >
                                    <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>

                                {/* Dynamic Auth View */}
                                {session?.user ? (
                                    /* Custom Floating Dropdown Menu Component */
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1.5 h-9 hover:bg-slate-100 dark:hover:bg-slate-900 focus-visible:ring-0">
                                                <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-800">
                                                    <AvatarImage src={session.user.image} alt={session.user.name} />
                                                    <AvatarFallback className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-[10px] font-bold uppercase">
                                                        {session.user.name ? session.user.name.substring(0, 2) : "US"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 capitalize">{session.user.name}</span>
                                                <span className="text-[9px] text-slate-400 transition-transform group-data-[state=open]:rotate-180">▼</span>
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-56 mt-2 p-1.5 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950 shadow-xl shadow-slate-200/40 dark:shadow-none animate-in fade-in slide-in-from-top-2 duration-200">
                                            {/* User Info Section */}
                                            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                                                <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider">
                                                    {session.user.role} Account
                                                </p>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{session.user.name}</p>
                                                <p className="text-[11px] text-slate-400 truncate mt-0.5">{session.user.email}</p>
                                            </div>

                                            <DropdownMenuItem asChild className="rounded-xl focus:bg-slate-100 dark:focus:bg-slate-900 focus:text-slate-900 dark:focus:text-slate-100 cursor-pointer">
                                                <Link href={`/dashboard/${session.user.role}`} className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" />
                                                    My Dashboard
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem asChild className="rounded-xl focus:bg-slate-100 dark:focus:bg-slate-900 focus:text-slate-900 dark:focus:text-slate-100 cursor-pointer">
                                                <Link href="/profile" className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                                    Profile Settings
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

                                            <DropdownMenuItem 
                                                onClick={handleLogout}
                                                className="rounded-xl focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20 dark:focus:text-red-400 cursor-pointer text-red-600 dark:text-red-400"
                                            >
                                                <div className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium">
                                                    <LogOut className="h-3.5 w-3.5" />
                                                    Log Out
                                                </div>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    /* Premium Pill Shaped CTA Button Actions */
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" asChild className="rounded-full text-xs font-medium px-4 h-8 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
                                            <Link href="/login">Login</Link>
                                        </Button>
                                        <Button asChild className="rounded-full bg-slate-950 hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-50 text-white px-5 h-8 text-xs font-medium transition-all shadow-sm">
                                            <Link href="/register">Get Started</Link>
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Safe client mount spacer framework sizing */
                            <div className="h-8 w-24 bg-transparent" />
                        )}
                    </div>

                    {/* Hamburger Drawer Menu for Mobile viewports */}
                    <div className="flex md:hidden items-center gap-2">
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-8 w-8 text-slate-500"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>

                </div>
            </nav>

            {/* Mobile Accordion Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden mx-auto max-w-7xl mt-2 rounded-2xl border border-slate-200/60 bg-white/95 dark:border-slate-800/60 dark:bg-slate-950/95 px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {session?.user && (
                        <Link
                            href={`/dashboard/${session.user.role}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
                        >
                            Dashboard
                        </Link>
                    )}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                        {session?.user ? (
                            <div className="space-y-0.5">
                                <div className="px-3 py-1.5 text-[10px] text-slate-400">
                                    <span className="text-violet-600 dark:text-violet-400 font-bold uppercase">{session.user.role}</span>
                                    <br />
                                    Signed in as {session.user.email}
                                </div>
                                <Link href={`/dashboard/${session.user.role}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">Dashboard</Link>
                                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">Profile Settings</Link>
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">Logout</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 p-1">
                                <Button variant="outline" asChild className="rounded-xl w-full h-8 text-xs">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                </Button>
                                <Button asChild className="rounded-xl w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-none h-8 text-xs">
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}