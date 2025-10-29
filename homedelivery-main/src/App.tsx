import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Benefits from './components/Benefits';
import QuoteForm from './components/QuoteForm';
import ContactForm from './components/ContactForm';
import Locations from './components/Locations';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <QuoteForm />
        <ContactForm />
        <Locations />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;
