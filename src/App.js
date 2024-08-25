import Plot from "./ThreeDPlot";

import "./styles.css";

export default function App() {
  const data = [
    [1, 1, 1],
    [-2, -1, 0],
    [3, 2, -3],
    [-4, 0, 4],
    [0, -3, 2],
  ];

  return (
    <div className="App">
      <h1>3D Plot with D3.js</h1>
      <Plot data={data} />
    </div>
  );
}
