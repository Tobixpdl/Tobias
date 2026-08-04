export function MascotFallback() {
  return (
    <div className="mascot-fallback" aria-hidden="true">
      <div className="mascot-fallback__head"><span /><span /></div>
      <div className="mascot-fallback__body"><i /></div>
      <div className="mascot-fallback__tablet"><span /><span /></div>
      <div className="mascot-fallback__arm mascot-fallback__arm--left" />
      <div className="mascot-fallback__arm mascot-fallback__arm--right" />
    </div>
  );
}
