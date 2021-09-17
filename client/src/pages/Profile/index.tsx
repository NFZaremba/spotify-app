import {
  Artists,
  Header,
  Playlists,
  Section,
  TrackList,
} from "../../shared/components";
import {
  useGetCurrentProfile,
  useGetCurrentUserPlaylists,
  useGetTopArtists,
  useGetTopTracks,
} from "../../shared/hooks/spotify";

const Profile = () => {
  const profile = useGetCurrentProfile();
  const playlists = useGetCurrentUserPlaylists();
  const topArtists = useGetTopArtists();
  const topTracks = useGetTopTracks({ limit: 10 });
  console.log(topTracks);

  return (
    <div>
      <Header profile={profile.data} playlists={playlists.data} />
      <main>
        <Section title="Top artists this month" seeAllLink="/top-artists">
          <Artists artists={topArtists?.data?.items.slice(0, 10)} />
        </Section>

        <Section title="Top tracks this month" seeAllLink="/top-tracks">
          <TrackList tracks={topTracks?.data?.items} />
        </Section>

        <Section title="Playlists" seeAllLink="/playlists">
          <Playlists playlists={playlists?.data?.items.slice(0, 10)} />
        </Section>
      </main>
    </div>
  );
};

export default Profile;
