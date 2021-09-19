import { useEffect } from "react";
import { Section } from "../../shared/components";
import { Playlists as PlaylistGrid } from "../../shared/components/";
import { useGetAllUserPlaylists } from "../../shared/hooks/spotify";

const Playlists = () => {
  const playlists = useGetAllUserPlaylists();

  useEffect(() => {
    if (playlists.hasNextPage) {
      playlists.fetchNextPage();
    }
  }, [playlists]);
  // console.log(playlists);

  return (
    <main>
      <Section title="Public Playlists" breadcrumb>
        {playlists && <PlaylistGrid playlists={playlists?.data?.pages} />}
      </Section>
    </main>
  );
};

export default Playlists;
