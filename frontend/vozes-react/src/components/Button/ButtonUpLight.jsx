import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./ButtonUpLight.css";

export default function ButtonUpLight({ dark }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="button-up"
      aria-label="Voltar ao topo"
      variant={dark ? "dark" : "light"}
    >
      <i className="bi bi-arrow-up"></i>
    </Button>
  );
}
