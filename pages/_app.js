import "../styles/globals.css";
import BottomNav from "../components/BottomNav";

export default function App({ Component, pageProps }) {
  return (
    <div className="container">
      <Component {...pageProps} />
      <BottomNav />
    </div>
  );
}
