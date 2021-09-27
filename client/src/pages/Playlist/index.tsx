import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader, Section, TrackList } from "../../shared/components";
import {
  useGetAudioFeaturesForTracks,
  useGetPlaylistById,
} from "../../shared/hooks/spotify";
import StyledDropdown from "./Dropdown/styles";
import Header from "./Header";

const Playlist = () => {
  const { id } = useParams<{ id: string }>();
  const [audioIds, setAudioIds] = useState<string[]>([]);

  const playlist = useGetPlaylistById(id);
  const audioFeatures = useGetAudioFeaturesForTracks(audioIds);

  const [sortValue, setSortValue] = useState("");
  const sortOptions = ["danceability", "tempo", "energy"];

  const initialData = playlist?.data?.pages[0].initialData;
  const trackList = playlist?.data?.pages[0].allTracks;

  useEffect(() => {
    if (playlist.hasNextPage) {
      playlist.fetchNextPage();
    }
    if (playlist.hasNextPage === false) {
      const trackIdList = playlist?.data?.pages[0].trackIdList;
      //   console.log(tracklist);
      trackIdList && setAudioIds(trackIdList);
    }
  }, [playlist.data]);

  useEffect(() => {
    if (audioFeatures.hasNextPage) {
      audioFeatures.fetchNextPage();
    }
  }, [audioFeatures.data]);

  // Map over tracks and add audio_features property to each track
  const tracksWithAudioFeatures = useMemo(() => {
    if (!trackList || audioFeatures.data?.pages.length !== audioIds.length) {
      return null;
    }
    const flattenAudioPages = audioFeatures.data?.pages.flatMap(
      (page) => page.audio_features
    );

    return trackList.map((track) => {
      const trackToAdd = track;

      if (!track.audio_features) {
        const audioFeaturesObj = flattenAudioPages.find((item) => {
          if (!item || !track) {
            return null;
          }
          return item.id === track.id;
        });

        trackToAdd["audio_features"] = audioFeaturesObj;
      }

      return trackToAdd;
    });
  }, [trackList, audioFeatures.data?.pages]);

  // Sort tracks by audio feature to be used in template
  const sortedTracks = useMemo(() => {
    if (!tracksWithAudioFeatures) {
      return null;
    }

    return [...tracksWithAudioFeatures].sort((a, b) => {
      const aFeatures = a["audio_features"];
      const bFeatures = b["audio_features"];

      return bFeatures[sortValue] - aFeatures[sortValue];
    });
  }, [sortValue, tracksWithAudioFeatures]);

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
              <StyledDropdown active={!!sortValue}>
                <label className="sr-only" htmlFor="order-select">
                  Sort tracks
                </label>
                <select
                  name="track-order"
                  id="order-select"
                  onChange={(e) => setSortValue(e.target.value)}
                >
                  <option value="">Sort tracks</option>
                  {sortOptions.map((option, i) => (
                    <option value={option} key={i}>
                      {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                    </option>
                  ))}
                </select>
              </StyledDropdown>
              {sortedTracks ? <TrackList tracks={sortedTracks} /> : <Loader />}
            </Section>
          </main>
        </>
      )}
    </>
  );
};

export default Playlist;
