// Tiny reactive store (OutSystems-ish: Screen Variables + UI reactivity)
export function createStore(initial) {
  let state = structuredClone(initial);
  const subs = new Set();

  function get() { return state; }
  function set(patch) {
    state = { ...state, ...patch };
    subs.forEach((fn) => fn(state));
  }
  function update(mutator) {
    const next = structuredClone(state);
    mutator(next);
    state = next;
    subs.forEach((fn) => fn(state));
  }
  function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }

  return { get, set, update, subscribe };
}
