export class User {
    constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly email: string,
      public readonly password: string,
      public readonly nickname: string,
      public readonly profilePicture: string
    ) { };
    
  }
  
  export interface UserInputDTO{
      name: string,
      email: string,
      password: string,
      nickname: string,
      profilePicture: string
  }
  
  export interface LoginInputDTO{
    email: string,
    password: string
  }
  
  export interface AuthenticationData {
    id: string;
  }