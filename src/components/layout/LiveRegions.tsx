export function LiveRegions() {
  return (
    <>
      <div id="a11y-live-polite" aria-live="polite" aria-atomic="true" className="sr-only" />
      <div id="a11y-live-assertive" aria-live="assertive" aria-atomic="true" role="alert" className="sr-only" />
    </>
  );
}
