export function useNetwork() {
    if (!navigator.onLine) alert("Упс, пропал интернет");
    return navigator.onLine;
}
