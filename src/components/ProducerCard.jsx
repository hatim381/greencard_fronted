import React from "react";

const ProducerCard = ({ producer }) => {
  const initial = producer?.name?.trim()?.charAt(0)?.toUpperCase() || "?";
  const address = producer?.default_address || "Adresse non renseignée";

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        boxShadow: "0 2px 8px #0001",
        padding: 16,
        display: "flex",
        gap: 14,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#ECFDF5",
          color: "#059669",
          fontWeight: 800,
          display: "grid",
          placeItems: "center",
          fontSize: 22,
          flexShrink: 0,
          border: "1px solid #D1FAE5",
        }}
      >
        {initial}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>
          {producer?.name || "Producteur"}
        </div>
        <div style={{ fontSize: 13.5, color: "#374151", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {address}
        </div>
        <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>
          {producer?.email}
        </div>
      </div>
    </div>
  );
};

export default ProducerCard;
