// export abstract class UsersApi {
//     private static usersAxios = Axios.create();

import Role from "./Role";
import Token from "./Token";

//     static async getAllUsers(): Promise<IUser[]>{
//       let url = 'https://reqres.in/api/users'
//       let response = await this.usersAxios.get<RequestInterface>(url);
//       return response.data.data;
//     }
//   }

export default interface User {
  username: string;
  email: string;
  tokens: Token[];
  country: string;
  role: Role;

  createdAt: string;
  updatedAt: string;

  profile: {
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
    picture: string;
  };
}
