import { Route, Switch } from "wouter";
import MapBox from "./components/MapBox";
import CsvFile from "./components/CsvFile";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={MapBox} />
        <Route path="/csv" component={CsvFile} />
      </Switch>
    </>
  );
}

export default App;
