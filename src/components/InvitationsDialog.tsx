"use client";

import { acceptInvitationAction } from "@/app/actions/accept-invitation";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { BellIcon } from "lucide-react";

type Invitation = {
  id: string;
  role: "MEMBER" | "ADMIN";
  organization: {
    name: string;
  };
};

function AcceptButton({ invitationId }: { invitationId: string }) {
  return (
    <form
      action={async () => {
        await acceptInvitationAction(invitationId);
      }}
    >
      <Button
        size="sm"
        type="submit"
        className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
      >
        Aceitar
      </Button>
    </form>
  );
}

export default function InvitationsDialog({
  invitations,
}: {
  invitations: Invitation[];
}) {
  if (invitations.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {invitations.length}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-dark">
        <DialogHeader>
          <DialogTitle>Convites Pendentes</DialogTitle>
          <DialogDescription>
            Você foi convidado para se juntar a estas organizações.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {invitations.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between p-2 rounded-md border"
            >
              <div>
                <p className="font-semibold">{invite.organization.name}</p>
                <p className="text-sm text-muted-foreground">
                  Convidado como: {invite.role}
                </p>
              </div>
              <AcceptButton invitationId={invite.id} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
