import { useEffect } from "react";

export function useKey(key, callback) {
  useEffect(
    function () {
      function keyFunction(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          callback();
        }
      }
      document.addEventListener("keydown", keyFunction);
      return function () {
        document.removeEventListener("keydown", keyFunction);
      };
    },
    [key, callback]
  );
}
