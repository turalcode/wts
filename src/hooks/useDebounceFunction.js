import {useRef} from "react";

export function useDebouncedFunction(fn, delay) {
    const ref = useRef(null);

    return (...args) => {
        clearTimeout(ref.current);
        ref.current = setTimeout(() => fn(...args), delay);
    };
}
