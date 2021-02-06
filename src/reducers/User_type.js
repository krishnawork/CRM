import { USER_TYPE } from "../actions/user";

export default function User_type(user_type = "", action) {
  if (action.type === USER_TYPE) {
    return action.payload.type;
  }
  return user_type;
}
