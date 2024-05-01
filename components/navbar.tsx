"use client";
import LanguageSwitcher from "@/components/languageSwitchert";
import { useLanguage } from "@/utils/languageContext";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useState } from "react";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Logo } from "@/components/icons";
import { formatName } from "@/utils/formatName";

type UserControlsProps = {
  session: Session | null;
};

export function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { translations } = useLanguage();
  // const siteConfig = translations.siteConfig as SiteConfig;
  const getNavItems = () => {
    const navItems = [];
    navItems.push(translations.siteConfig.navItems[0]); // Events

    if (session) {
      if (session.user.role === "user") {
        navItems.push(translations.siteConfig.navItems[1]); // My Applications
      }
      if (session.user.role === "admin") {
        return translations.siteConfig.navItems; // All items
      }
    }

    return navItems;
  };
  const desktopNavItems = getNavItems();
  const mobileNavItems = getNavItems();
  // console.log(translations)
  const UserAuth: React.FC<UserControlsProps> = ({ session }) => {
    return (
      <>
        {session ? (
          <>
            <NavbarItem>
              <p>{formatName(session.user.userInfo?.firstName)}</p>
            </NavbarItem>
            <NavbarItem>
              <button onClick={() => signOut()}>
                {translations.strings.logout}
              </button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <button onClick={() => signIn()}>
                {translations.strings.login}
              </button>
            </NavbarItem>
          </>
        )}
      </>
    );
  };

  return (
    <NextUINavbar
      maxWidth="xl"
      classNames={{ wrapper: "gap-6" }}
      // add this line
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="data-[justify=start]:flex-grow-0">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {/* <Logo /> */}
            <p className="font-bold text-inherit">OCN</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {desktopNavItems.map((item: { label: string; href: string }) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <UserAuth session={session} />
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
          <LanguageSwitcher />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <UserAuth session={session} />
        <ThemeSwitch />
        <LanguageSwitcher />
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {mobileNavItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color="foreground" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
}
