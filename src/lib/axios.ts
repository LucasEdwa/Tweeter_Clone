import axios from "axios";

const api = {
  getCurrentUser: async () => {
    const { data } = await axios.get("/api/get-current-user");
    return data;
  },
  getUser: async (userId: string) => {
    const { data } = await axios.get("/api/get-user/" + userId);
    return data;
  },
  followUser: async (userId: string) => {
    const { data } = await axios.post("/api/follow-user/" + userId);
    return data;
  },
  createPost: async (postData: { content: String }) => {
    const { data } = await axios.post("/api/create-post", postData);
    return data;
  },
  getPosts: async () => {
    try {
      const { data } = await axios.get("/api/get-posts");
      return data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },
  getUserPosts: async (userId: string) => {
    const { data } = await axios.get("/api/get-user-posts/" + userId);
    return data;
  },
  getPost: async (postId: string) => {
    try {
      const { data } = await axios.get(`/api/get-post/${postId}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch post:", error);
      throw new Error("Failed to fetch post");
    }
  },
  likePost: async (postId: string) => {
    const { data } = await axios.post("/api/like-post/" + postId);
    return data;
  },
  replyToPost: async (postId: string, content: { content: string }) => {
    const { data } = await axios.post("/api/reply-to-post/" + postId, content);
    return data;
  },
  likeReplyToPost: async (replyId: string) => {
    const { data } = await axios.post("/api/like-reply-to-post/" + replyId);
    return data;
  },
  searchUsers: async (content: { content: string }) => {
    const { data } = await axios.post("/api/search-users", content);
    return data;
  },
  readNotifications: async () => {
    const { data } = await axios.post("/api/read-notifications");
    return data;
  },
  getNotifications: async () => {
    const { data } = await axios.get("/api/get-notifications");
    return data;
  },
  getUnreadNotifications: async () => {
    const { data } = await axios.get("/api/get-unread-notifications");
    return data;
  },

  retweet: async (postId: string, content: string) => {
    try {
      const { data } = await axios.post(`/api/retweet/${postId}`, { content });
      return data;
    } catch (error) {
      console.error("Failed to retweet:", error);
      throw new Error("Failed to retweet");
    }
  },
  getRetweets: async () => {
    try {
      const { data } = await axios.get("/api/get-retweets");
      return data;
    } catch (error) {
      console.error("Failed to fetch retweets:", error);
      throw new Error("Failed to fetch retweets");
    }
  },
};
export default api;
