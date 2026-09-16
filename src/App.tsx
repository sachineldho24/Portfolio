import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header, FloatingNav, Footer, LoadingScreen } from "./Shell";
import { Home } from "./Home";
import { Work, ProjectDetail, NotFound } from "./Work";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, [pathname]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = "Sachin Eldho | AI Engineer";
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <LoadingScreen />
      <Header />
      <div key={pathname} className="route-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
      <FloatingNav />
    </>
  );
}
