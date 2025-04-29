import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar_acern";
import { Clock2, House, Play } from "lucide-react";

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
                <SidebarLink
                    link={{
                        label: "Graj",
                        href: "/quizowa",
                        icon: (
                            <Play />
                        )
                    }}
                />

            </SidebarBody>
        </Sidebar>
    );
}
