import { useState } from "react";

export default function Transfer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function search(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/market/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setResults(data);
  }

  async function buy(player) {
    setBusyId(player.player.id);
    const fee = player.player.injured ? 0 : Math.round((player.statistics?.[0]?.games?.rating || 5) * 1000000);
    const res = await fetch("/api/market/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: player.player.id,
        name: player.player.name,
        fromClub: player.statistics?.[0]?.team?.name,
        fee,
      }),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    alert(`${player.player.name} transfer edildi.`);
  }

  return (
    <div>
      <h2>Transfer pazarı</h2>
      <form onSubmit={search} style={{ marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Oyuncu adı ara"
          style={{ marginBottom: 8 }}
        />
        <button type="submit">Ara</button>
      </form>

      {error && <p style={{ color: "#b3261e" }}>{error}</p>}

      {results.map((r) => (
        <div className="card" key={r.player.id}>
          <p style={{ fontWeight: 600, margin: 0 }}>{r.player.name}</p>
          <p style={{ fontSize: 13, color: "#6b6a63", margin: "2px 0 10px" }}>
            {r.statistics?.[0]?.team?.name} · {r.player.age} yaş · {r.statistics?.[0]?.games?.position}
          </p>
          <button disabled={busyId === r.player.id} onClick={() => buy(r)}>
            {busyId === r.player.id ? "İşleniyor..." : "Teklif ver"}
          </button>
        </div>
      ))}
    </div>
  );
}
