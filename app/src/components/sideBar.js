import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar_acern";
import { Clock2, House } from "lucide-react";

export default function Sidebarr() {
    return (
        <Sidebar>
            <SidebarBody>
                <SidebarLink
                    link={{
                        label: "Main",
                        href: "/",
                        icon: (
                            <House />
                        )
                    }}
                />
                <SidebarLink
                    link={{
                        label: "History",
                        href: "/history",
                        icon: (
                            <Clock2 />
                        )
                    }}
                />

            </SidebarBody>
        </Sidebar>
    );
}
