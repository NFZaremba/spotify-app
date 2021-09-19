import { useState } from "react";
import { Section, TimeRangeButtons, TrackList } from "../../shared/components";
import { useGetTopTracks } from "../../shared/hooks/spotify";

const TopTracks = () => {
  const [activeRange, setActiveRange] = useState<"short" | "medium" | "long">(
    "short"
  );
  const topTracks = useGetTopTracks({
    time_range: `${activeRange}_term`,
    limit: 10,
  });

  return (
    <main>
      <Section title="Top Artists" breadcrumb>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topTracks && topTracks?.data?.items && (
          <TrackList tracks={topTracks?.data?.items} />
        )}
      </Section>
    </main>
  );
};

export default TopTracks;
