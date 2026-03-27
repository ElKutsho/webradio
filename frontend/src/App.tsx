import { PlayerProvider } from './context/PlayerContext';
import { Layout } from './components/Layout';
import { NowPlaying } from './components/NowPlaying';
import { LiveDJIndicator } from './components/LiveDJIndicator';
import { ListenerCount } from './components/ListenerCount';
import { AudioPlayer } from './components/AudioPlayer';

function App() {
  return (
    <PlayerProvider>
      <div className="animated-bg" />
      <div className="grain-overlay" />
      <Layout>
        <LiveDJIndicator />
        <NowPlaying />
        <ListenerCount />
      </Layout>
      <AudioPlayer />
    </PlayerProvider>
  );
}

export default App;
