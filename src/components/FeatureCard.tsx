import React from "react";

interface Props {
  icon: string;
  title: string;
  text: string;
}

export default function FeatureCard({ icon, title, text }: Props) {
  return (
    <div className="feature-card h-100 p-4">
      <div className="feature-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h5 className="mb-2 text-white text-center">{title}</h5>
      <p className="mb-0 text-white-50 text-center small">{text}</p>
    </div>
  );
}
