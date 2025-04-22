import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar_acern";

export default function Sidebarr() {
    return (
        <Sidebar>
            <SidebarBody>
                <SidebarLink
                    link={{
                        label: "history",
                        href: "/history",
                        icon: (
                            <img
                                src="https://assets.aceternity.com/manu.png"
                                className="h-7 w-7 shrink-0 rounded-full"
                                width={50}
                                height={50}
                                alt="Avatar"
                            />
                        )
                    }}
                />
                <SidebarLink
                    link={{
                        label: "Main",
                        href: "/",
                        icon: (
                            <img
                                src="https://assets.aceternity.com/manu.png"
                                className="h-7 w-7 shrink-0 rounded-full"
                                width={50}
                                height={50}
                                alt="Avatar"
                            />
                        )
                    }}
                />
            </SidebarBody>
        </Sidebar>
    );
}
