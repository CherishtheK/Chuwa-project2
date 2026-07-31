import { useState } from "react";
import { message } from "antd";

interface Props {
  inviting: boolean;
  onInvite: (name: string, email: string) => Promise<boolean>;
}

export default function TokenGenerator({ inviting, onInvite }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      message.error("Name and email are required");
      return;
    }
    const ok = await onInvite(name.trim(), email.trim());
    if (ok) {
      setName("");
      setEmail("");
    }
  };

  return (
    <div className="mt-6 rounded-xl bg-primary p-6 text-white">
      <p className="font-bold">Invite a new employee</p>
      <p className="text-sm text-white/80">
        Generate a registration token and email the signup link. Tokens expire
        after 3 hours.
      </p>
      <div className="mt-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="rounded-lg px-3 py-2 text-sm text-gray-900 bg-white"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="w-64 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white"
        />
        <button
          onClick={handleSubmit}
          disabled={inviting}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
        >
          {inviting ? "Sending…" : "+ Generate token & send email"}
        </button>
      </div>
    </div>
  );
}
