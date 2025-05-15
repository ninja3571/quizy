import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar_acern";
import { Clock2, House, LogOut, Play } from "lucide-react";
import PocketBase from 'pocketbase';

export default function Sidebarr() {

    const pb = new PocketBase('http://172.16.15.146:8080');
    const logout = async () => {
        pb.authStore.clear();
    }

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
                            <LogOut />
                        ),
                    }}
                    onClick={logout}
                    className="absolute bottom-5"
                />

            </SidebarBody>
        </Sidebar>
    );
}
