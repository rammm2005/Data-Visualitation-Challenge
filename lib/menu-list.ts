import {
    Users,
    Settings,
    SquarePen,
    LayoutGrid,
    Link,
    LucideIcon,
    Braces
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active?: boolean;
};

type Menu = {
    href: string;
    label: string;
    active?: boolean;
    icon: LucideIcon;
    submenus?: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/dashboard",
                    label: "Dashboard",
                    icon: LayoutGrid,
                    submenus: []
                }
            ]
        },
        {
            groupLabel: "Contents",
            menus: [
                {
                    href: "",
                    label: "Posts",
                    icon: SquarePen,
                    submenus: [
                        {
                            href: "/posts",
                            label: "All Posts"
                        },
                        {
                            href: "/posts/new",
                            label: "New Post"
                        }
                    ]
                },
                {
                    href: "/visualization",
                    label: "Data Visualitations",
                    icon: Braces
                },
                {
                    href: "/excel-sheet",
                    label: "Excel Link & Sheet",
                    icon: Link
                }
            ]
        },
        {
            groupLabel: "Settings",
            menus: [
                {
                    href: "/users",
                    label: "Users",
                    icon: Users
                },
                {
                    href: "/account",
                    label: "Account",
                    icon: Settings
                }
            ]
        }
    ];
}