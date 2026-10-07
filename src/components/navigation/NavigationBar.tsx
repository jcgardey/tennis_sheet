import * as React from 'react';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

export const NavigationBar: React.FC = () => {
  const t = useTranslations('Navigation');

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href={`/sheet`} className="mr-8 flex items-center space-x-2">
          <img src="/logo.png" alt="Tennis Sheet" className="h-16 w-auto" />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem asChild>
              <Link
                href={`/sheet`}
                className={'[&.active]:text-accent-foreground'}
              >
                {t('courts')}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem asChild>
              <Link
                href={`/sheet`}
                className={'[&.active]:text-accent-foreground'}
              >
                {t('coaches')}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <LocaleSwitcher />
      </div>
    </div>
  );
};
