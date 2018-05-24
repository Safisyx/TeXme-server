import {User} from "../entities/User";
export const containsUser = (users: User[], user: User) => {
  return users.map(u=>u.id)
              .includes(user.id)
}
