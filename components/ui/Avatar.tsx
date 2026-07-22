import React from "react";

interface AvatarProps {
  initials?: string;
  size?: "sm" | "md" | "lg";
}

const sizePx = { sm: 28, md: 36, lg: 44 };
const fontSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

export function Avatar({ initials = "NC", size = "md" }: AvatarProps) {
  const px = sizePx[size];

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer select-none group"
      role="button"
      tabIndex={0}
      aria-label="User profile menu"
      id="profile-avatar-btn"
      style={{ width: px, height: px }}
    >
      {/* Gradient ring */}
      <div
        className="absolute inset-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background:
            "linear-gradient(135deg, var(--nc-accent) 0%, #a78bfa 50%, #38bdf8 100%)",
          padding: "1.5px",
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: "var(--nc-bg-surface)" }}
        />
      </div>

      {/* Avatar face */}
      <div
        className={[
          "absolute inset-[1.5px] rounded-full flex items-center justify-center",
          fontSizes[size],
          "font-semibold tracking-wide",
        ].join(" ")}
        style={{
          background: "linear-gradient(135deg, #3b2f8f 0%, #1e1b4b 100%)",
          color: "var(--nc-accent-text)",
        }}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Online indicator */}
      <span
        className="absolute bottom-0 right-0 block rounded-full"
        style={{
          width: size === "sm" ? 7 : 9,
          height: size === "sm" ? 7 : 9,
          background: "#22c55e",
          border: "1.5px solid var(--nc-bg-surface)",
        }}
        aria-label="Online"
      />
    </div>
  );
}
