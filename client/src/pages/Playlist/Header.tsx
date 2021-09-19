import StyledHeader from "../../shared/styles/header";
import { IPlaylist } from "../../shared/types/spotify";

const Header = ({
  images,
  followers,
  tracks,
  name,
}: Omit<IPlaylist, "id" | "total">) => {
  return (
    <StyledHeader>
      <div className="header__inner">
        {images?.length && images[0]?.url && (
          <img
            className="header__img"
            src={images[0].url}
            alt="Playlist Artwork"
          />
        )}
        <div>
          <div className="header__overline">Playlist</div>
          <h1 className="header__name">{name}</h1>
          <p className="header__meta">
            {followers?.total ? (
              <span>
                {followers?.total}{" "}
                {`follower${followers?.total !== 1 ? "s" : ""}`}
              </span>
            ) : null}
            <span>
              {tracks?.total} {`song${tracks?.total !== 1 ? "s" : ""}`}
            </span>
          </p>
        </div>
      </div>
    </StyledHeader>
  );
};

export default Header;
