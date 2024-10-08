import './Countdown.css';
import logoPumped from '../assets/pumpedTextPlainLogo.png';
import Model3D from '../Model3D/Model3D';
import GlassBox from '../Components/Glassbox';
import { useEffect, useState } from 'react';
import Marquee from "react-fast-marquee";

function Countdown() {
  const targetDate = new Date('2024-09-25T18:00:00');
  const [email, setEmail] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const calculateTimeLeft = () => {
    const difference = targetDate - new Date();
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendEmailHandler = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(email)) {
      setShowPopup(true);
      try {
        const data = fetch('https://us-central1-pumped-8bd42.cloudfunctions.net/api/subscribe', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email
          })
        });
        console.log(data);
      }
      catch (error) {
        console.log("failed to send email");
      }

      setTimeout(() => {
        setShowPopup(false);

      }, 3000);
      setEmail("");
    } else {

    }

  };

  useEffect(() => {
    console.log("loaded");
  }, [isLoaded])

  function onLoaded() {
    setIsLoaded(true);
  }

  return (
    <div className='Countdown'>
      <div className={`${isLoaded ? "Countdown-Container background-gradient" : "Countdown-Container background-gradient displaynone"}`}>
        <div className='topBar'>
          <img src={logoPumped} alt="logo" width={"auto"} height={"100%"} />
        </div>
        <div className='content'>
          <div className='content-header unselectable'>
            <h1>STAY <span style={{ fontWeight: 800, color: "#ffff" }}>PUMPED</span>!</h1>
            <div className='counter unselectable'>
              <GlassBox upperText={"days"} bottomText={timeLeft.days} />
              <GlassBox upperText={"hours"} bottomText={timeLeft.hours} />
              <GlassBox upperText={"minutes"} bottomText={timeLeft.minutes} />
              <GlassBox upperText={"seconds"} bottomText={timeLeft.seconds} />
            </div>
          </div>
          <div className='content-mid'>
            <Marquee className="h1s" speed={130} gradient={false} pauseOnClick={true}>
              <h1 className='unselectable'>Coming soon...</h1>
            </Marquee>
            <Model3D onLoaded={onLoaded} />
          </div>
          <div className='content-footer'>
            <h1>Join the <span style={{ color: "#F7C542" }}>fitness</span> revolution!</h1>
            <div className='subscribe-container'>
              <input type='text' className='left-side' placeholder='Type your email...' value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className='right-side' onClick={sendEmailHandler}>
                <p>{showPopup ? "Joined" : "Join"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isLoaded && <div className="loadingscreen"><div className="spinner"></div></div>}
    </div>
  );
}

export default Countdown;
