import { useEffect, useState } from "react";

const CATEGORY_LABELS = {
  macGunuGelirleri: "Maç günü geliri",
  yayinGelirleri: "Yayın geliri",
  sponsorlukGelirleri: "Sponsorluk geliri",
  transferGelirleri: "Transfer geliri",
  transferGiderleri: "Transfer gideri",
  maasGiderleri: "Maaş gideri",
  primler: "Primler",
  borclar: "Borç işlemi",
};

function money(n) {
  return `€${(n / 1000000).toFixed(2)}M`;
}

export default function Finans() {
  const [finance, setFinance] = useState(null);
  const [error, setError] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    fetch("/api/finance")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setFinance(data);
      });
  }

  useEffect(load, []);

  async function runAction(action, amount) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/finance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, amount }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setFinance(data);
  }

  if (error) return <p style={{ color: "#b3261e" }}>{error}</p>;
  if (!finance) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>Finans</h2>

      <div className="card">
        <p className="card-title">Kulüp kasası</p>
        <p className="card-value">{money(finance.cash)}</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <p className="card-title">Haftalık sponsorluk</p>
          <p className="card-value">{money(finance.sponsorshipWeekly)}</p>
        </div>
        <div className="card">
          <p className="card-title">Borç</p>
          <p className="card-value">{money(finance.debt)}</p>
        </div>
      </div>

      <div className="card">
        <button disabled={busy} onClick={() => runAction("advanceWeek")}>
          {busy ? "İşleniyor..." : "Haftayı ilerlet"}
        </button>
      </div>

      <div className="card">
        <p className="card-title">Kredi al / borç öde</p>
        <input
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="Tutar (€)"
          type="number"
          style={{ marginBottom: 8 }}
        />
        <div className="grid-2">
          <button disabled={busy} onClick={() => runAction("loan", Number(loanAmount))}>
            Kredi al
          </button>
          <button disabled={busy} onClick={() => runAction("repay", Number(loanAmount))}>
            Borç öde
          </button>
        </div>
      </div>

      <div className="card">
        <p className="card-title">Son işlemler</p>
        {finance.transactions.length === 0 && (
          <p style={{ color: "#6b6a63", fontSize: 14 }}>Henüz işlem yok.</p>
        )}
        {finance.transactions.slice(0, 20).map((t, i) => (
          <div className="row" key={i}>
            <div>
              <p style={{ margin: 0, fontSize: 14 }}>
                {CATEGORY_LABELS[t.category] || t.category}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b6a63" }}>
                {t.note} · {new Date(t.date).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <span style={{ fontWeight: 600, color: t.type === "income" ? "#1d7a4c" : "#b3261e" }}>
              {t.type === "income" ? "+" : "-"}
              {money(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
