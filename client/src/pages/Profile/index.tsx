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
  const playlists = useGetCurrentUserPlaylists({ limit: 10 });
  const topArtists = useGetTopArtists({ limit: 10 });
  const topTracks = useGetTopTracks({ limit: 10 });

  return (
    <div>
      <Header profile={profile.data} playlists={playlists.data} />
      <main>
        <Section title="Top artists this month" seeAllLink="/top-artists">
          <Artists artists={topArtists?.data?.items} />
        </Section>

        <Section title="Top tracks this month" seeAllLink="/top-tracks">
          <TrackList tracks={topTracks?.data?.items} />
        </Section>

        <Section title="Playlists" seeAllLink="/playlists">
          <Playlists playlists={playlists?.data?.items} />
        </Section>
      </main>
    </div>
  );
};

export default Profile;
