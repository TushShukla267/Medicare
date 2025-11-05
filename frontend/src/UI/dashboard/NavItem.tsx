import React from "react";

interface NavItemProps {
  icon: React.ReactElement;
  label: string;
  active?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function NavItem({ icon, label, active = false, onClick = () => {}, compact = false }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-gradient-to-r from-primary to-primary-glow text-white shadow-glow' 
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      } ${compact ? 'justify-center' : ''}`}
    >
      <span className={active ? 'scale-110' : ''}>{React.cloneElement(icon, { size: 20 })}</span>
      {!compact && <span className="font-medium">{label}</span>}
    </button>
  );
}
