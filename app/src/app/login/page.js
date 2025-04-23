import { FlickeringGrid } from "@/components/magicui/flickering-grid";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function Home() {
  return (
    // tło - modyfikacje
    <div className="overflow-hidden">
      <FlickeringGrid
        squareSize={8}
        gridGap={2}
        color="#008050"
        maxOpacity={0.6}
        flickerChance={0.1}
      />

      {/* div logowania */}
      <Tabs defaultValue="account" className="w-[400px] absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]">
        <TabsContent value="account">
          <Card className="bg-[rgba(168,171,201,0.2)] backdrop-blur-[2px] border-2 border-black">
            <CardHeader>
              <CardTitle className="flex justify-center scale-[150%]">Log in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="1username">Username</Label>
                <Input id="1username" placeholder="username" className="placeholder:text-emerald-900 border-black" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="1pass">Password</Label>
                <Input id="1pass" placeholder="password" className="placeholder:text-emerald-900 border-black" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="w-[40%]">Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* div revestracji */}
        <TabsContent value="register">
          <Card className="bg-[rgba(102,102,153,0.2)] backdrop-blur-[2px] border-2 border-black">
            <CardHeader>
              <CardTitle className="flex justify-center scale-[150%]">Sign up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="2username">Username</Label>
                <Input id="2username" placeholder="username" className="placeholder:text-emerald-900 border-black" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="2pass">Password</Label>
                <Input id="2pass" placeholder="password" className="placeholder:text-emerald-900 border-black" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="2pass2">Repeat Password</Label>
                <Input id="2pass2" placeholder="password" className="placeholder:text-emerald-900 border-black" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="w-[40%]">Sign Up</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* zmiana logowania na rejestracje */}
        <TabsList className="grid w-full grid-cols-2 bg-[rgba(148,148,184,0.4)] border-2 border-black p-0">
          <TabsTrigger value="account">Log In</TabsTrigger>
          <TabsTrigger value="register">Sign Up</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
