import { PlayerProvider } from './context/PlayerContext';
import { Layout } from './components/Layout';
import { NowPlaying } from './components/NowPlaying';
import { ListenerCount } from './components/ListenerCount';
import { AudioPlayer } from './components/AudioPlayer';
import { SongHistory } from './components/SongHistory';

function App() {
  return (
    <PlayerProvider>
      <div className="animated-bg" />
      <div className="grain-overlay" />
      <Layout>
        <NowPlaying />
        <ListenerCount />
        <SongHistory />
      </Layout>
      <AudioPlayer />
    </PlayerProvider>
  );
}

export default App;
