import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar_acern";
import { Clock2, House, LogOut, Play } from "lucide-react";

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
                <SidebarLink
                    link={{
                        label: "Wyloguj",
                        href: "/login",
                        icon: (
                            <LogOut/>
                        ),
                    }}
                    className="absolute bottom-5"
                />

            </SidebarBody>
        </Sidebar>
    );
}
