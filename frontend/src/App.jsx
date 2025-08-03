import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';
import About from "./components/About";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--chrono-bg)] text-[var(--chrono-text)]">
      <Navbar />

      <main className="flex-grow flex flex-col items-center px-4 py-8">
        <Timer />
        <Dashboard />
        <About />
      </main>

      <Footer />
    </div>
  );
}
