import React from 'react';
import Asana from '../Asana/Asana';
import { useNavigate, useLocation } from "react-router";
import './Home.css'; // Import the CSS file for styling

const HomePage = () => {
  const asanas = [
    {
      id: 1,
      name: 'Padmasana',
      imageUrl: '/Image/pad2.jpg',
    },
    {
      id: 2,
      name: 'Savasana',
      imageUrl: '/Image/sava2.jpg',
    },
    {
      id: 3,
      name: 'Bhujangasana',
      imageUrl: '/Image/bhuj1.avif',
    },
    {
      id: 4,
      name: 'Trikonasana',
      imageUrl: '/Image/trik2.avif',
    },
    {
      id: 5,
      name: 'Janu Sirasana',
      imageUrl: '/Image/janu1.webp',
    },
    {
      id: 6,
      name: 'Tadasana',
      imageUrl: '/Image/tad1.avif',
    },

  ];

  const navigate = useNavigate();
  const navigateAsana = (id) =>{
    console.log("id");
    console.log(id);
     navigate(`/asana/${id}`);
  };

  return (
    <div className="home-page">
      <header>
        <h1>Welcome to Yoga Training</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/classes">Classes</a></li>
            <li><a href="/schedule">Schedule</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="hero-section">
          <h2>Find Your Inner Peace</h2>
        
          <div className="asanas-page">
            <h1>Yoga Asanas</h1>
            <div className="asanas-container">
              {asanas.map((asana) => (
                <div key={asana.id} className="asana-card" onClick={() => navigateAsana(asana.id)}>

                  <img src={asana.imageUrl} alt={asana.name} />
                  <p>{asana.name}</p>

                </div>
              ))}
            </div>
          </div>

        </section>
        <section className="about-section">
          <h2>About Us</h2>
          <p>Learn about our experienced instructors and our commitment to your well-being.</p>
          <a href="/about" className="cta-button">Learn More</a>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 Yoga Training</p>
      </footer>
    </div>
  );
};

export default HomePage;
