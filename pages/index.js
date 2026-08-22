import { useEffect, useState } from "react";

export default function Home() {
  const [club, setClub] = useState(null);
  const [fixtures, setFixtures] = useState(null);
  const [clubNameInput, setClubNameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/club")
      .then((r) => r.json())
      .then((data) => {
        setClub(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (club?.clubTeamId) {
      fetch("/api/fixtures")
        .then((r) => r.json())
        .then(setFixtures);
    }
  }, [club]);

  async function selectClub(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/club", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubName: clubNameInput }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setClub(data);
  }

  if (loading) return <p>Yükleniyor...</p>;

  if (!club) {
    return (
      <div>
        <h2>Kulübünü seç</h2>
        <p style={{ color: "#6b6a63", fontSize: 14 }}>
          Desteklenen 10 ligden gerçek bir kulüp adı yaz (örn. Fenerbahce, Arsenal, Real Madrid).
        </p>
        <form onSubmit={selectClub}>
          <input
            value={clubNameInput}
            onChange={(e) => setClubNameInput(e.target.value)}
            placeholder="Kulüp adı"
            style={{ marginBottom: 10 }}
          />
          <button type="submit">Kulübü seç</button>
        </form>
        {error && <p style={{ color: "#b3261e" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <p style={{ fontWeight: 600, fontSize: 17, margin: 0 }}>{club.clubName}</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <p className="card-title">Kulüp kasası</p>
          <p className="card-value">€{(club.finance.cash / 1000000).toFixed(1)}M</p>
        </div>
        <div className="card">
          <p className="card-title">Borç</p>
          <p className="card-value">€{(club.finance.debt / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {fixtures && (
        <div className="card">
          <p className="card-title">Son gerçek maç</p>
          {fixtures.lastMatch ? (
            <p style={{ margin: "0 0 10px" }}>
              {fixtures.lastMatch.teams.home.name} {fixtures.lastMatch.goals.home} - {fixtures.lastMatch.goals.away} {fixtures.lastMatch.teams.away.name}
            </p>
          ) : (
            <p style={{ color: "#6b6a63" }}>Kayıt yok</p>
          )}
          <p className="card-title">Sonraki gerçek maç</p>
          {fixtures.nextMatch ? (
            <p style={{ margin: 0 }}>
              {fixtures.nextMatch.teams.home.name} vs {fixtures.nextMatch.teams.away.name} ·{" "}
              {new Date(fixtures.nextMatch.fixture.date).toLocaleDateString("tr-TR")}
            </p>
          ) : (
            <p style={{ color: "#6b6a63" }}>Planlanmış maç yok</p>
          )}
        </div>
      )}
    </div>
  );
}
