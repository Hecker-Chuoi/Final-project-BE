import User from "../db/userModel.js";
import UserResponse from "../dto/response/UserResponse.js";

export const UserMapper = {
    toResponse: (user) => new UserResponse(user._id, user.user_name, user.first_name, user.last_name),
    toResponses: (users) => { return users.map(e => UserMapper.toResponse(e)) }
}