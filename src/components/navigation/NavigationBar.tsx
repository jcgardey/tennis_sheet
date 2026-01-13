import * as React from 'react';
import { Link } from '@tanstack/react-router';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import logoImage from '@/assets/tennis_sheet_full_logo_transparent.png';

export const NavigationBar: React.FC = () => {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <img src={logoImage} alt="Tennis Sheet" className="h-16 w-auto" />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/sheet"
                  className={'[&.active]:text-accent-foreground'}
                >
                  Courts
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/sheet"
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
