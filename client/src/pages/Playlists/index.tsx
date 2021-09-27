import { useEffect } from "react";
import { Loader, Section } from "../../shared/components";
import { Playlists as PlaylistGrid } from "../../shared/components/";
import { useGetAllUserPlaylists } from "../../shared/hooks/spotify";

const Playlists = () => {
  const playlists = useGetAllUserPlaylists();

  useEffect(() => {
    if (playlists.hasNextPage) {
      playlists.fetchNextPage();
    }
  }, [playlists]);

  if (playlists.isLoading) {
    return <Loader />;
  }

  return (
    <main>
      <Section title="Public Playlists" breadcrumb>
        {playlists && <PlaylistGrid playlists={playlists?.data?.pages} />}
      </Section>
    </main>
  );
};

export default Playlists;
