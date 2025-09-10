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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";
import { sendInvitationAction } from "@/app/actions/send-invitation";

const initialState = { message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
      disabled={pending}
    >
      {pending ? "Enviando..." : "Enviar Convite"}
    </Button>
  );
}

export default function SendInviteDialog({
  orgId,
  orgName,
}: {
  orgId: string;
  orgName: string;
}) {
  const [state, formAction] = useFormState(
    sendInvitationAction.bind(null, orgId),
    initialState
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.message === "Convite enviado com sucesso!") {
      setTimeout(() => setIsOpen(false), 1500);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-dark cursor-pointer" size="sm">
          Convidar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dark">
        <DialogHeader>
          <DialogTitle>Convidar para {orgName}</DialogTitle>
          <DialogDescription>
            Envie um convite para um novo membro se juntar à sua organização.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="role">Função</Label>
            <Select name="role" defaultValue="MEMBER">
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Membro (Member)</SelectItem>
                <SelectItem value="ADMIN">Administrador (Admin)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            {state?.message && (
              <p className="text-sm text-muted-foreground">{state.message}</p>
            )}
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
