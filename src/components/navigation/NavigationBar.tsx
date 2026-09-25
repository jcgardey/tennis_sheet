import * as React from 'react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

export const NavigationBar: React.FC = () => {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/sheet" className="mr-8 flex items-center space-x-2">
          <img src="/logo.png" alt="Tennis Sheet" className="h-16 w-auto" />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/sheet"
                  className={'[&.active]:text-accent-foreground'}
                >
                  Courts
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/sheet"
                  className={'[&.active]:text-accent-foreground'}
                >
                  Coaches
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
