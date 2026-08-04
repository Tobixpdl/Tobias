import { IndustriesSlider } from "../../components/IndustriesSlider/IndustriesSlider";

export function Industries() {
  return (
    <section className="industries" aria-label="Rubros con los que trabajo">
      <div className="industries__intro shell" data-reveal="split">
        <span>Rubros que se mueven</span>
        <p>Arrastrá para explorar</p>
      </div>
      <IndustriesSlider />
    </section>
  );
}
