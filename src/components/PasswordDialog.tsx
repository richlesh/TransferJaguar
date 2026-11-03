import { useEffect, useRef, useState } from "react";
import type { PasswordPrompt } from "../shared/types";

interface Props {
  prompt: PasswordPrompt;
  onSubmit: (password: string) => void;
  onCancel: () => void;
}

/**
 * Prompt for a password when password auth is selected but none is stored for
 * the site (or its jump host). Submitting retries the connection with the typed
 * password, used for that one attempt and never persisted. This is what makes a
 * blank-password site actually ask the user instead of failing with "all
 * configured authentication methods failed".
 */
export function PasswordDialog({ prompt, onSubmit, onCancel }: Props) {
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the field as soon as the dialog appears so the user can just type.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => onSubmit(password);

  const target = `${prompt.username}@${prompt.host}:${prompt.port}`;

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div className="dialog" style={{ width: 420 }} onClick={(e) => e.stopPropagation()}>
        <h3>{prompt.forJumpHost ? "Jump host password" : "Password required"}</h3>
        <p>
          Enter the password for <strong>{target}</strong>
          {prompt.forJumpHost ? " (jump host)" : ""}.
        </p>
        <input
          ref={inputRef}
          type="password"
          value={password}
          autoComplete="off"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            else if (e.key === "Escape") onCancel();
          }}
          style={{ width: "100%", boxSizing: "border-box", marginTop: 4 }}
        />
        <div className="dialog-actions">
          <button className="secondary" onClick={onCancel}>Cancel</button>
          <button onClick={submit} disabled={password.length === 0}>Connect</button>
        </div>
      </div>
    </div>
  );
}
