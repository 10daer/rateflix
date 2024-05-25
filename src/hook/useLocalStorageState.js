import { useEffect, useState } from "react";

export function useLocalStorageState(initial, key) {
  const [val, setVal] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [val, key]);
  return [val, setVal];
}
