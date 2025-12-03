import React from "react";
import { Button } from "./ui/button";
import { useConnection } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useBalance } from "wagmi";
import { formatEther } from "viem";
import Image from "next/image";

interface HeaderProps {
  userRole: "student" | "teacher" | "donor";
  setUserRole: (role: "student" | "teacher" | "donor") => void;
}

export default function Header({ userRole, setUserRole }: HeaderProps) {
  const { isConnected, address } = useConnection();
  const { open } = useAppKit();
  const { data: balance } = useBalance({ address });

  const handleConnection = () => {
    if (!isConnected) {
      open({ view: "Connect" });
    } else {
      open({ view: "Account" });
    }
  };

  return (
    <div>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Image
              src="/logo1.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <h1 className="text-2xl font-bold text-blue-600">D-Imara</h1>
            </div>
            <div
              className={`flex gap-2 items-center ${
                isConnected ? "block" : "hidden"
              }`}
            >
              <Button
                variant={userRole === "student" ? "default" : "ghost"}
                onClick={() => setUserRole("student")}
                size="sm"
                className={
                  userRole === "student"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "text-slate-700 hover:bg-slate-100"
                }
              >
                Student
              </Button>
              <Button
                variant={userRole === "teacher" ? "default" : "ghost"}
                onClick={() => setUserRole("teacher")}
                size="sm"
                className={
                  userRole === "teacher"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "text-slate-700 hover:bg-slate-100"
                }
              >
                Teacher
              </Button>
              <Button
                variant={userRole === "donor" ? "default" : "ghost"}
                onClick={() => setUserRole("donor")}
                size="sm"
                className={
                  userRole === "donor"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "text-slate-700 hover:bg-slate-100"
                }
              >
                Donor
              </Button>
            </div>
            {isConnected ? (
              <Button
                onClick={handleConnection}
                variant="outline"
                size="sm"
                className="ml-4 py-2 px-5"
              >
                {`${address?.slice(0, 6)}...${address?.slice(
                  -4
                )} | ${formatEther(balance?.value || BigInt(0))} ${
                  balance?.symbol
                }`}
              </Button>
            ) : (
              <Button
                onClick={handleConnection}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
