import { useState, useEffect, useRef } from "react";

export const useObserver = () => {
  const [isOnTop, setIsOnTop] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const options = {
      root: null,
      rootMargin: "1px 0px 0px 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(([entry]) => {
      setIsOnTop(!entry.isIntersecting);
    }, options);

    const target = ref.current;
    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []); 

  return [isOnTop, ref];
};

