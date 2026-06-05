export class Bus {
  #map = new Map();
  on(type, fn) {
    if (!this.#map.has(type)) this.#map.set(type, new Set());
    this.#map.get(type).add(fn);
    return () => this.#map.get(type)?.delete(fn);
  }
  emit(type, detail) {
    (this.#map.get(type) || []).forEach((fn) => fn(detail));
  }
}
