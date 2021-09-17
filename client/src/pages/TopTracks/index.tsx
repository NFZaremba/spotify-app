import { useState } from "react";
import { Section, TimeRangeButtons, TrackList } from "../../shared/components";
import { useGetTopTracks } from "../../shared/hooks/spotify";

const TopTracks = () => {
  const [activeRange, setActiveRange] = useState<"short" | "medium" | "long">(
    "short"
  );
  const topTracks = useGetTopTracks({ time_range: `${activeRange}_term` });

  return (
    <main>
      <Section title="Top Artists" breadcrumb>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topTracks && topTracks?.data?.items && (
          <TrackList tracks={topTracks?.data?.items.slice(0, 10)} />
        )}
      </Section>
    </main>
  );
};

export default TopTracks;
