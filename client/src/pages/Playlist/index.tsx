import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Section, TrackList } from "../../shared/components";
import {
  useGetAudioFeaturesForTracks,
  useGetPlaylistById,
} from "../../shared/hooks/spotify";
import Header from "./Header";

const Playlist = () => {
  const { id } = useParams<{ id: string }>();
  const [audioIds, setAudioIds] = useState<string[]>([]);

  const playlist = useGetPlaylistById(id);
  const audioFeatures = useGetAudioFeaturesForTracks(audioIds);

  const initialData = playlist?.data?.pages[0].initialData;
  const trackList = playlist?.data?.pages[0].allTracks;
  //   console.log(audioFeatures);
  useEffect(() => {
    if (playlist.hasNextPage) {
      playlist.fetchNextPage();
    }
    if (playlist.hasNextPage === false) {
      const tracklist = playlist?.data?.pages[0].trackIdList;
      //   console.log(tracklist);
      tracklist && setAudioIds(tracklist);
    }
  }, [playlist.data]);

  return (
    <>
      {initialData && trackList && (
        <>
          <Header
            images={initialData.images}
            name={initialData.name}
            followers={initialData.followers}
            tracks={initialData.tracks}
          />

          <main>
            <Section title="Playlist" breadcrumb>
              <TrackList tracks={trackList} />
            </Section>
          </main>
        </>
      )}
    </>
  );
};

export default Playlist;
