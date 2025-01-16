import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Deploy',
      children: [
        {
          label: 'Factory',
          href: '/deploy/factory',
        },
        {
          label: 'ERC-721',
          href: '/deploy/erc721',
        },
        {
          label: 'ERC-1155',
          href: '/deploy/erc1155',
        },
      ],
    },
    {
      label: 'Marketplace',
      children: [
        {
          label: 'All Listings',
          href: '/marketplace/listings',
        },
        {
            label: 'My NFTs',
            href: '/marketplace/portfolio',
        },
        {
          label: 'My Listings',
          href: '/marketplace/my-listings',
        }
      ],
    },
  ];

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            NFT Marketplace
          </h2>
          <div className="space-y-1">
            {routes.map((route) => {
              if (route.children) {
                return (
                  <div key={route.label} className="space-y-1">
                    <h3 className="px-4 text-sm font-medium text-gray-500">
                      {route.label}
                    </h3>
                    {route.children.map((child) => (
                      <Button
                        key={child.href}
                        variant={pathname === child.href ? "secondary" : "ghost"}
                        className="w-full justify-start pl-8"
                        asChild
                      >
                        <Link href={child.href}>
                          {child.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                );
              }

              return (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={route.href}>
                    {route.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 