import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ElectionExplorer from "./pages/ElectionExplorer";

function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={ElectionExplorer} />
        <Route>
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-muted-foreground">Page not found</p>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
