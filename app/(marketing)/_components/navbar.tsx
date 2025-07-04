"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";

import Logo from "./logo";
import Link from 'next/link';

const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const scrolled = useScrollTop();
    return (
        <div
            className={cn("z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 flex items-center w-full p-6",
                scrolled && "border-b shadow-sm")}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {isLoading &&
                    <Spinner />
                }
                {!isLoading && !isAuthenticated &&
                    <>
                        <SignInButton mode="modal">
                            <Button variant="ghost" size="sm">
                                Login
                            </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <Button size="sm">
                                Get BabyNotion
                            </Button>
                        </SignInButton>
                    </>
                }
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">
                                Documents
                            </Link>
                        </Button>
                        <UserButton />
                    </>
                )}
                <ModeToggle />
            </div>
        </div>
    )
}

export default Navbar
