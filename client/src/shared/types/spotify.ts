export type ImageType = {
  url: string;
};

export interface IArtist {
  images: ImageType[];
  name: string;
}

export interface IPlaylist {
  id: string;
  total: number;
  images: ImageType[];
  name: string;
  followers?: {
    total: number;
  };
  tracks?: {
    total: number;
  };
}

export interface IProfile {
  display_name: string;
  images: ImageType[];
  followers: {
    total: number;
  };
}

export interface IAudioFeatures {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
}

export interface ITrack {
  name: string;
  album: {
    name: string;
    images: ImageType[];
  };
  artists: IArtist[];
  duration_ms: number;
  audio_features: IAudioFeatures;
}

// hooks
export interface Options {
  time_range?: string;
  limit?: number;
}
