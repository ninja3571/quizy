import Link from "next/link";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function NavBar(){
    return(
    <div className="flex flex-row gap-6 w-full justify-center rounded-b-full border-2 border-amber-500 py-3 relative">
        <Link href="/history">History</Link>
        <Link href="/">Main</Link>
        <Link href="/login">Login</Link>

        <Sheet>
            <SheetTrigger className='absolute right-6'>        
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
        </Sheet>

    </div>
    )
}