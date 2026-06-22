"use client";

import React from "react";
import Link from "next/link";

import { Envelope, Globe, LogoGithub, LogoLinkedin, MapPin, Rocket } from '@gravity-ui/icons';
import { FaXTwitter } from "react-icons/fa6";
import { Logo } from "@/components/Logo";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-slate-200/60 bg-white/50 px-4 py-12 sm:px-6 lg:px-8 dark:border-slate-800/50 dark:bg-slate-950/50 backdrop-blur-md mt-auto">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-4">

                    {/* Column 1: Brand & Description [Logo Requirement] */}
                    <div className="space-y-4 md:col-span-1">
                        <Logo />
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                            Bridging the gap between visionary startup founders and exceptionally talented collaborators to build the next generation of industry-defining teams.
                        </p>
                    </div>

                    {/* Column 2: Quick Links [Quick Links Requirement] */}
                    <div className="space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Platform Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/startups" className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors">
                                    Browse Startups
                                </Link>
                            </li>
                            <li>
                                <Link href="/opportunities" className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors">
                                    Browse Opportunities
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info [Contact Information Requirement] */}
                    <div className="space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Contact Us
                        </h4>
                        <ul className="space-y-2.5">
                            <li className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Envelope className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <a href="mailto:support@startupfrontier.com" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                                    support@startupfrontier.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">Chittagong Division</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Social Accounts [Social Links Requirement] */}
                    <div className="space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Community Connect
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Follow our journey and stay updated with newly posted team opportunities.
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-950 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-white dark:hover:text-white"
                                aria-label="GitHub Repository Link"
                            >
                                <LogoGithub className="h-4 w-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-950 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-white dark:hover:text-white"
                                aria-label="LinkedIn Profile Link"
                            >
                                <LogoLinkedin className="h-4 w-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-950 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-white dark:hover:text-white"
                                aria-label="Twitter X Link"
                            >
                                <FaXTwitter className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Separator and Bottom Copyright [Copyright Requirement] */}
                <div className="mt-8 border-t border-slate-100 pt-6 text-center dark:border-slate-800/60">
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        &copy; {currentYear} StartupFrontier. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}