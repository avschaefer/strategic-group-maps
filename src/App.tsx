import { Sidebar } from './components/sidebar/Sidebar';
import { MapsPage } from './components/maps/MapsPage';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <MapsPage />
    </div>
  );
}

export default App;
