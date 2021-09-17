import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Playlists, Profile, TopArtists } from "../pages";
import Logout from "../pages/Logout";
import TopTracks from "../pages/TopTracks";
import ScrollToTop from "../shared/utils/scrollToTop";

const Routes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Logout />
      <Switch>
        <Route path="/top-artists">
          <TopArtists />
        </Route>
        <Route path="/top-tracks">
          <TopTracks />
        </Route>
        <Route path="/playlists/:id">
          <h1>Playlist</h1>
        </Route>
        <Route path="/playlists">
          <Playlists />
        </Route>
        <Route path="/">
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
