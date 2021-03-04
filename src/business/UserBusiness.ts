import { UserDatabase } from "../data/UserDatabase";
import { LoginInputDTO, User, UserInputDTO } from "./entities/User";
import { CustomError } from "./error/CustomError";
import { Authenticator } from "./services/Authenticator";
import { HashManager } from "./services/HashManager";
import { IdGenerator } from "./services/IdGenerator";

export class UserBusiness {

    constructor (
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator,
        private userDatabase: UserDatabase
    ) { }

    async createUser(user: UserInputDTO){
        try {
            if(!user.name || !user.email || !user.password || !user.nickname || !user.profilePicture){
            throw new CustomError(
              406,
              "Please fullfil all the available fields: 'name', 'email', 'password', 'nickname' and 'profile picture'."
            );
        }
 
        if(user.password.length < 6){
            throw new CustomError(422, "Invalid password. Your password must have at least six characters.");
        }
 
        if(user.email.indexOf("@") === -1){
             throw new CustomError(
               422,
               "Invalid email."
             );
 
        }
 
        const id = this.idGenerator.generate();
 
        const hashPassword = await this.hashManager.hash(user.password);
 
        const newUser: User = new User(
            id,
            user.name,
            user.email,
            hashPassword,
            user.nickname,
            user.profilePicture
        )
 
        await this.userDatabase.createUser(newUser);
 
        const accessToken = this.authenticator.generateToken({
            id
        })
 
        return accessToken;
 
    } catch (error) {
        throw new CustomError(error.statusCode, error.message);
        }
    }

    async insertUser(user: LoginInputDTO){
            const userDB = await this.userDatabase.getUserByEmail(user.email)

            const comparePassword = await this.hashManager.compare(user.password, userDB.password)

            const token = await this.authenticator.generateToken({id: userDB.id})

            if(!comparePassword){
                throw new CustomError(401, 'Password did not match')
                
            }

            return token
    }
}