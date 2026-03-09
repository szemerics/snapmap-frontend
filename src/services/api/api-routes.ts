export const apiRoutes = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  photos: "/api/photos",
  users: "/api/users",
  myUser: "/api/users/me",
  updateProfile: "/api/users/update-profile-data",
  updateProfilePicture: "/api/users/update-profile-picture",
  likePhoto: "/api/photos/like/:photoId",
  addComment: "/api/photos/comment/:photoId",
  addReply: "/api/photos/comment/:photoId/reply/:commentId",
}
