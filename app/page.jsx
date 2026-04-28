import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Doctors from "./components/Doctors";
import AppointmentForm from "./components/AppointmentForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Doctors />
        <AppointmentForm />
      </main>
      <Footer />
    </>
  );
}
