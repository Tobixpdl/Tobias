import { IndustriesSlider } from "../../components/IndustriesSlider/IndustriesSlider";

export function Industries() {
  return (
    <section className="industries" aria-label="Rubros con los que trabajo">
      <div className="industries__intro shell" data-reveal="split">
        <span>Una web para cada tipo de negocio</span>
        <p>Se mueven solas · también podés arrastrar</p>
      </div>
      <IndustriesSlider />
    </section>
  );
}
