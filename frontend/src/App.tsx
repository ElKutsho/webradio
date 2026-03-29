import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Layout } from './components/Layout';
import { NowPlaying } from './components/NowPlaying';
import { ListenerCount } from './components/ListenerCount';
import { AudioPlayer } from './components/AudioPlayer';
import { SongHistory } from './components/SongHistory';
import { useAccentColor } from './hooks/useAccentColor';

function AppContent() {
  const { nowPlaying } = usePlayer();
  useAccentColor(nowPlaying?.now_playing?.song?.art);

  return (
    <>
      <div className="animated-bg" />
      <div className="grain-overlay" />
      <Layout>
        <NowPlaying />
        <ListenerCount />
        <SongHistory />
      </Layout>
      <AudioPlayer />
    </>
  );
}

function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}

export default App;
