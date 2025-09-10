"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { createOrganizationAction } from "@/app/actions/create-organization";

const initialState = { message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
    >
      {pending ? "Criando..." : "Criar Organização"}
    </Button>
  );
}

export default function CreateOrgDialog() {
  const [state, formAction] = useFormState(
    createOrganizationAction,
    initialState
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.message === "Organização criada com sucesso!") {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.message]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer">
          Criar Organização
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dark">
        <DialogHeader>
          <DialogTitle>Criar Nova Organização</DialogTitle>
          <DialogDescription>
            Dê um nome para sua nova organização. Você será o administrador.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name" className="text-right">
              Nome da Organização
            </Label>
            <Input id="name" name="name" type="text" required minLength={3} />
          </div>
          <DialogFooter>
            {state?.message && (
              <p
                className={`text-sm ${
                  state.message.includes("sucesso")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {state.message}
              </p>
            )}
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
