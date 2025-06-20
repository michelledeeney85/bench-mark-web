import benchMarkerIcon from '../../assets/benchMarker.png';

const TitleBar = () => {
  return (
    <div className="mapview-title">
        <div className="flex-row">
          <img src={benchMarkerIcon}/>
          <div className="flex-col">
            <h2>BenchMark</h2>     
            <h3>Find benches near you!</h3>
            <p>(Web version 1.0)</p>
          </div>
        </div>     
      </div>
  );
}

export default TitleBar;