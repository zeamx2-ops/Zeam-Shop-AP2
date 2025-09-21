import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import MainShop from "./components/MainShop";

function App() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div>
      {!accepted ? (
        <WelcomeScreen onAccept={() => setAccepted(true)} />
      ) : (
        <MainShop />
      )}
    </div>
  );
}

export default App;
