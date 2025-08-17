import React from "react";

type IconType = string | React.ReactNode;

interface Props {
  icon: IconType;
  title: string;
  text: string;
}

export default function FeatureCard({ icon, title, text }: Props) {
  const renderIcon = () => {
    if (typeof icon === "string") {
      // Evita duplicar 'bi ' si ya viene incluido
      const cls = icon.startsWith("bi") ? icon : `bi ${icon}`;
      return <i className={cls} aria-hidden="true" />;
    }
    // Si es un ReactNode (ej. <svg/>), lo devolvemos tal cual
    return icon;
  };

  return (
    <div className="feature-card h-100 p-4">
      <div className="feature-icon">
        {renderIcon()}
      </div>
      <h5 className="mb-2 text-white text-center">{title}</h5>
      <p className="mb-0 text-white-50 text-center small">{text}</p>
    </div>
  );
}
