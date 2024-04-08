import { useEffect } from "react";
import "./Preloader.scss";
import cat from "../../img/cat2.png";

const Preloader = ({ loaded }) => {
  useEffect(() => {}, []);

  return (
    <div className={`preloader${loaded ? " loaded" : ""}`}>
      <img src={cat} alt="Tim The Cat" />
    </div>
  );
};

export default Preloader;
