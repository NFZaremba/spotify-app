export type ImageType = {
  url: string;
};

export interface IArtist {
  images: ImageType[];
  name: string;
}

export interface ITrack {
  name: string;
  album: {
    name: string;
    images: ImageType[];
  };
  artists: IArtist[];
  duration_ms: number;
}

export interface IPlaylist {
  id: string;
  total: number;
  images: ImageType[];
  name: string;
}

export interface IProfile {
  display_name: string;
  images: ImageType[];
  followers: {
    total: number;
  };
}

// hooks
export interface Options {
  time_range?: string;
  limit?: number;
}
