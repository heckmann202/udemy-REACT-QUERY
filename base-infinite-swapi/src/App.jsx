import "./App.css";
import { InfinitePeople } from "./people/InfinitePeople";
import { InfiniteSpecies } from "./species/InfiniteSpecies";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

function App() {
  return (
    <div className="App">
      <h1>Infinite SWAPI</h1>
      <QueryClientProvider client={queryClient}>

        {/* <InfinitePeople /> */}
        <InfiniteSpecies />
        <ReactQueryDevtools/>
      </QueryClientProvider>
    </div>
  );
}

export default App;
