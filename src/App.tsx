import { Route, Router, Switch } from "wouter";
import MapBox from "./components/MapBox";
import CsvFile from "./components/CsvFile";
import { useHashLocation } from "wouter/use-hash-location";

function App() {
  return (
    <>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/" component={MapBox} />
          <Route path="/csv" component={CsvFile} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
