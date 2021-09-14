import { useGetCurrentProfile } from "../../shared/hooks/spotify";

const Profile = () => {
  const { isLoading, isError, data, error } = useGetCurrentProfile();

  return (
    <div>
      {data ? (
        <div>
          <h1>{data.display_name}</h1>
          <p>{data.followers.total} Followers</p>
          {data.images.length && data.images[0].url && (
            <img src={data.images[0].url} alt="avatar" />
          )}
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
};

export default Profile;
