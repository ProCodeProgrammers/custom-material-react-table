import { useState } from "react";

import "./App.css";
import Schema from "./components/containers/Schema";
import TableComponent from "./components/containers/CustomTable1";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Schema /> */}
      <TableComponent />
    </>
  );
}

export default App;
