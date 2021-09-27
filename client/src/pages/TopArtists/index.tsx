import { useState } from "react";
import {
  Artists,
  Loader,
  Section,
  TimeRangeButtons,
} from "../../shared/components";
import { useGetTopArtists } from "../../shared/hooks/spotify";

const TopArtists = () => {
  const [activeRange, setActiveRange] = useState<"short" | "medium" | "long">(
    "short"
  );
  const topArtists = useGetTopArtists({ time_range: `${activeRange}_term` });

  if (topArtists.isLoading) {
    return <Loader />;
  }

  return (
    <main>
      <Section title="Top Artists" breadcrumb>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topArtists && topArtists?.data?.items && (
          <Artists artists={topArtists?.data?.items} />
        )}
      </Section>
    </main>
  );
};

export default TopArtists;
