import { ExpandableCardDemo } from "@/components/historyView_acern";
import Sidebarr from "@/components/sideBar";

export default function Home() {
  return (
    <div>
      <div className="absolute">
        <Sidebarr />
      </div>
      <ExpandableCardDemo classname="absolute" />
    </div>
  );
}
