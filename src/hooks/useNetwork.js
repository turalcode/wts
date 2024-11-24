export function useNetwork() {
    if (!navigator.onLine) alert("Нет подключения к интернету");
    return navigator.onLine;
}
