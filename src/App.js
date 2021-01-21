import React, { useState } from 'react';
import './App.css';
import Pages from './pages'
import Main from "./main";
// import cv from './service/cv';
import Studio from './Studio';

function App() {
  const [selected, setSelected] = useState("image");
  // useEffect(() => {
  //   const init = async () => {
  //     console.log(await cv.load());
  //   }
  //   init();
  // }, [])
  return (
    <div className="App">
      <header>
        <ul style={{ display: "flex", justifyContent: "space-around", listStyle: "none" }}>
          <li onClick={() => setSelected("video")}>
            Video
          </li>
          <li onClick={() => setSelected("image")}>
            Image
          </li>
          <li onClick={() => setSelected("studio")}>
            Studio
          </li>
        </ul>
      </header>

      {selected === "video" && <Pages />}
      {selected === "image" && <Main />}
      {selected === "studio" && <Studio />}
    </div>
  );
}

export default App;
