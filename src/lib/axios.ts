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
      const { data } = await axios.get("/api/get-post/" + postId);
      return data;
    } catch (error) {
      console.log(error);
      return undefined;
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
};
export default api;
