import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ContinueWatchingRow from "../components/ContinueWatchingRow";
import TrendingTicker from "../components/TrendingTicker";
import LiveGrid from "../components/LiveGrid";
import Pricing from "../components/Pricing";
import Devices from "../components/Devices";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ContinueWatchingRow />
        <TrendingTicker />
        <LiveGrid />
        <Pricing />
        <Devices />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
