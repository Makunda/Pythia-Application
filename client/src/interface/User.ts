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

export default interface Account {
  username: string;
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  tokens: Token[];
  country: string;
  role: Role;
  profile: {
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
    picture: string;
  };
}
