import { useEffect, useRef } from "react";
import {
  Link as RouterLink,
  LinkProps,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { flushSync } from "react-dom";

/** Native view transitions reproduce the reference's overlapping page slide. */
export function Link({
  onClick,
  delay = 0,
  ...props
}: LinkProps & { delay?: number }) {
  const navigate = useNavigate(),
    location = useLocation(),
    timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <RouterLink
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        )
          return;
        event.preventDefault();
        if (props.to === location.pathname) return;
        const go = () => {
          if (
            !document.startViewTransition ||
            matchMedia("(prefers-reduced-motion: reduce)").matches
          ) {
            navigate(props.to);
            return;
          }
          document.documentElement.dataset.transitioning = "";
          const transition = document.startViewTransition(() =>
            flushSync(() => navigate(props.to)),
          );
          void transition.finished
            .catch(() => {})
            .finally(
              () => delete document.documentElement.dataset.transitioning,
            );
        };
        clearTimeout(timer.current);
        if (delay) timer.current = setTimeout(go, delay);
        else go();
      }}
    />
  );
}
