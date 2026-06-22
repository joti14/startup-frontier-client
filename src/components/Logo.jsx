"use client";

import Image from "next/image";
import Link from "next/link";
import logoImage from "@/app/assets/logo.webp";

export function Logo({
  width = 28,
  height = 28,
  hideText = false,
  link = true,
  href = "/",
  className = "",
  logoClassName = "",
  textClassName = "",
}) {
  const logoContent = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 transition-transform group-hover:scale-105">
        <Image
          src={logoImage}
          alt="StartupFrontier"
          width={width}
          height={height}
          className={`rounded-full ${logoClassName}`}
        />
      </span>
      {!hideText && (
        <span className={`font-semibold tracking-tight ${textClassName}`}>
          startup<span className="text-violet-600 dark:text-violet-400">Frontier</span>
        </span>
      )}
    </>
  );

  const wrapperClassName = `flex items-center gap-2.5 ${className}`.trim();

  if (link) {
    return (
      <Link href={href} className={wrapperClassName}>
        {logoContent}
      </Link>
    );
  }

  return <div className={wrapperClassName}>{logoContent}</div>;
}
