import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Profile } from "../pages";
import Logout from "../pages/Logout";
import ScrollToTop from "../shared/utils/scrollToTop";

const Routes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Logout />
      <Switch>
        <Route path="/top-artists">
          <h1>Top Artists</h1>
        </Route>
        <Route path="/top-tracks">
          <h1>Top Tracks</h1>
        </Route>
        <Route path="/playlists/:id">
          <h1>Playlist</h1>
        </Route>
        <Route path="/playlists">
          <h1>Playlists</h1>
        </Route>
        <Route path="/">
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
