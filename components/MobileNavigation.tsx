"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AlignRightIcon } from "lucide-react";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.action";
interface Props {
  fullName: string;
  avatar: string;
  email: string;
}
const MobileNavigation = ({ fullName, avatar, email }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div>
      <header className="mobile-header">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          width={120}
          height={52}
          alt="logo"
          className="h-auto"
        />

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <AlignRightIcon />
          </SheetTrigger>
          <SheetContent className="shad-sheet h-screen px-3">
            <SheetHeader>
              <SheetTitle>
                <div className="header-user text-left">
                  <Image
                    src={avatar}
                    width={44}
                    height={44}
                    alt="avatar"
                    className="header-user-avatar"
                  />
                  <div className="sm:hidden lg:block">
                    <p className="subtitle-2 capitalize">{fullName}</p>
                    <p className="caption">{email}</p>
                  </div>
                </div>
              </SheetTitle>
              <nav className="mobile-nav">
                <ul className="mobile-nav-list">
                  {navItems.map(({ url, name, icon }) => (
                    <Link href={url} key={name} className="lg:w-full">
                      <li
                        className={cn(
                          "mobile-nav-item",
                          pathname === url && "shad-active"
                        )}
                      >
                        <Image
                          src={icon}
                          width={24}
                          height={24}
                          alt={name}
                          className={cn(
                            "nav-icon",
                            pathname === url && "nav-icon-active"
                          )}
                        />
                        <p>{name}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              </nav>

              <div className="flex flex-col gap-5 justify-between pb-5">
                <FileUploader/>
                <Button type="submit" className="mobile-sign-out-button"
                  onClick={async()=>await signOutUser()}
                >
                  <Image
                    src="/assets/icons/logout.svg"
                    width={24}
                    height={24}
                    alt="logout"
                  />
                  <p>Logout</p>
                </Button>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
};

export default MobileNavigation;
