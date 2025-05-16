'use client'

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

import { useState } from "react";
import PocketBase from 'pocketbase';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/toggleTheme";

export default function Home() {

  const pb = new PocketBase('http://172.16.15.146:8080');
  // const pb = new PocketBase('http://192.168.60.25:8080');

  const router = useRouter()

  if (pb.authStore.model && pb.authStore.model != null) {
    router.push("/")
  }

  const [pass, setPass] = useState(null)
  const [pass2, setPass2] = useState(null)
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)

  const reset = async () => {
    setEmail(null)
    setPass(null)
    setPass2(null)
    setName(null)
  }

  const signIn = async () => {

    console.log(name, email, pass, pass2)
    const data = {
      "username": name,
      "email": email,
      "emailVisibility": true,
      "password": pass,
      "passwordConfirm": pass2,
    };

    console.log(data)

    if (name != null && email != null && pass != null && pass == pass2) {
      console.log(data)
      const record = await pb.collection('users').create(data);
    }

    else {

      if (name == null || name == "") {
        toast("nie wpisano nazwy użytkownika", {
          action: {
            label: "X",
            onClick: () => console.log("X"),
          },
        })
      }

      if (email == null || email == "") {
        toast("nie wpisano email-a", {
          action: {
            label: "X",
            onClick: () => console.log("X"),
          },
        })
      }

      if (pass != pass2 && pass != null && pass2 != null) {
        toast("wpisano inne hasła", {
          action: {
            label: "X",
            onClick: () => console.log("X"),
          },
        })
      }

      if ((pass == null || pass == "") || (pass2 == null || pass2 == "")) {
        toast("nie wpisano hasła", {
          action: {
            label: "X",
            onClick: () => console.log("X"),
          },
        })
      }

      else if (pass == pass2 && pass.length < 8) {
        toast("wpisano za krótkie hasło", {
          action: {
            label: "X",
            onClick: () => console.log("X"),
          },
        })
      }
    }

  }

  const logIn = async () => {
    console.log(name, pass)

    if (name != null && pass != null && pass.length >= 8) {
      try {
        const authData = await pb.collection('users').authWithPassword(name, pass);

      }
      catch (err) {
        console.log(err)
        toast("wpisano nie właściwe hasło lub nazwe/email", {
          action: {
            label: "X",
            onClick: () => console.log("X"),
          },
        })
      }
      finally {
        if (pb.authStore.model) {
          router.push("/")
        }
      }

      console.log(pb.authStore.model);
    }
    else {
      if (name == null || name == "") {
        toast("nie wpisano nazwy użytkownika / email", {
          action: {
            label: "X",
            onClick: () => console.log("X"),
          },
        })
      }

      if (pass == null || pass == "") {
        toast("nie wpisano hasła", {
          action: {
            label: "X",
            onClick: () => console.log("X"),
          },
        })
      }

      if (pass != null && pass.length < 8) {
        toast("wpisano za krótkie hasło", {
          action: {
            label: "X",
            onClick: () => console.log("X"),
          },
        })
      }
    }

  }

  return (
    // tło - modyfikacje
    <div className="overflow-hidden">
      <div className="absolute right-5 bottom-5">
        <ModeToggle />
      </div>
      <FlickeringGrid
        squareSize={8}
        gridGap={2}
        color="#008050"
        maxOpacity={0.6}
        flickerChance={0.005}
      />

      {/* div logowania */}
      <Tabs defaultValue="account" className="w-[400px] absolute bottom-[30%] left-[50%] translate-x-[-50%]">
        <TabsContent value="account">
          <Card className="bg-[rgba(168,171,201,0.2)] backdrop-blur-[2px] border-2 border-black">
            <CardHeader>
              <CardTitle className="flex justify-center scale-[150%]">Log in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="1username">Username or Email</Label>
                <Input id="1username" placeholder="username / email" className="placeholder:text-emerald-900 border-black dark:placeholder:text-emerald-400" onChange={(e) => { setName(e.target.value) }} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="1pass">Password</Label>
                <Input id="1pass" placeholder="password" type="password" className="placeholder:text-emerald-900 border-black dark:placeholder:text-emerald-400" onChange={(e) => { setPass(e.target.value) }} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="w-[40%]" onClick={logIn}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* div revestracji */}
        <TabsContent value="register">
          <Card className="bg-[rgba(168,171,201,0.2)] backdrop-blur-[2px] border-2 border-black">
            <CardHeader>
              <CardTitle className="flex justify-center scale-[150%]">Sign up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="2username">Username</Label>
                <Input id="2username" placeholder="username" className="placeholder:text-emerald-900 border-black dark:placeholder:text-emerald-400" onChange={(e) => { setName(e.target.value) }} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="1pass">Email</Label>
                <Input id="email" placeholder="email" className="placeholder:text-emerald-900 border-black dark:placeholder:text-emerald-400" onChange={(e) => { setEmail(e.target.value) }} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="2pass">Password</Label>
                <Input id="2pass" type="password" placeholder="password" className="placeholder:text-emerald-900 border-black dark:placeholder:text-emerald-400" onChange={(e) => { setPass(e.target.value) }} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="2pass2">Repeat Password</Label>
                <Input id="2pass2" type="password" placeholder="repeat password" className="placeholder:text-emerald-900 border-black dark:placeholder:text-emerald-400" onChange={(e) => { setPass2(e.target.value) }} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="w-[40%]" onClick={signIn}>Sign Up</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* zmiana logowania na rejestracje */}
        <TabsList className="grid w-full grid-cols-2 bg-[rgba(148,148,184,0.4)] border-2 border-black p-0" onClick={reset}>
          <TabsTrigger value="account">Log In</TabsTrigger>
          <TabsTrigger value="register">Sign Up</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
