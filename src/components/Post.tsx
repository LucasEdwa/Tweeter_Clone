export default function Post({ post }) {
  return (
    <div className="flex flex-col  gap-2 p-4 border-b-gray-700">
      <div className="flex gap-2">
        <img src={post.user.image} className="w-10 rounded-full" alt="user" />
        <div className=" flex flex-col">
          <h3 className="font-semibold text-lg">{post.user.name}</h3>
          <h4 className="text-gray-700 text-sm">@{post.user.email}</h4>
        </div>
      </div>
      <p className="py-2">{post.content}</p>
      <div className="flex justify-between items-center px-4">
        <button className="text-gray-700">Reply</button>
        <button className="text-gray-700">Retweet</button>
        <button className="text-gray-700">Like</button>
        <div>
          <button className="text-gray-700">Share</button>
        </div>
      </div>
    </div>
  );
}
