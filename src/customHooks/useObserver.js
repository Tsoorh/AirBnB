import { useState, useEffect, useRef } from "react";

export const useObserver = () => {
  const [isOnTop, setIsOnTop] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const options = {
      root: null,
      rootMargin: "-10px 0px 0px 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(([entry]) => {
      setIsOnTop(!entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.unobserve(ref.current);
    };
  }, []); 

  return [isOnTop, ref];
};

