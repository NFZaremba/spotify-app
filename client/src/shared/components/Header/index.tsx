import { IPlaylist, IProfile } from "../../types/spotify";
import StyledHeader from "./styles";

interface IHeader {
  profile: IProfile;
  playlists: IPlaylist;
}

const Header = ({ profile, playlists }: IHeader) => {
  return (
    <>
      {profile && playlists ? (
        <StyledHeader type="user">
          <div className="header__inner">
            {profile.images.length && profile.images[0].url && (
              <img
                className="header__img"
                src={profile.images[0].url}
                alt="avatar"
              />
            )}
            <div>
              <div className="header__overline">Profile</div>
              <h1 className="header__name">{profile.display_name}</h1>
              <p className="header__meta">
                {playlists && (
                  <span>
                    {playlists.total} Playlist
                    {playlists.total !== 1 ? "s" : ""}
                  </span>
                )}
                <span>
                  {profile.followers.total} Follower
                  {profile.followers.total !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
          </div>
        </StyledHeader>
      ) : (
        <div>...loading</div>
      )}
    </>
  );
};

export default Header;
