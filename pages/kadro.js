import { useEffect, useState } from "react";

export default function Kadro() {
  const [players, setPlayers] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/squad")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPlayers(data);
      });
  }, []);

  if (error) return <p style={{ color: "#b3261e" }}>{error}</p>;
  if (!players) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>Kadro</h2>
      {players.map((p) => (
        <div className="card" key={p.id}>
          <div className="row" style={{ border: "none", padding: 0 }}>
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>{p.name}</p>
              <p style={{ fontSize: 13, color: "#6b6a63", margin: "2px 0 0" }}>
                {p.position} · {p.age} yaş
              </p>
            </div>
            {p.acquiredOn && (
              <span style={{ fontSize: 11, color: "#6b6a63" }}>
                {new Date(p.acquiredOn).toLocaleDateString("tr-TR")} transfer
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
