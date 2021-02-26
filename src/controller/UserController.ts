import { Request, Response } from 'express'
import { LoginInputDTO, UserInputDTO } from '../business/entities/User'
import { Authenticator } from '../business/services/Authenticator'
import { HashManager } from '../business/services/HashManager'
import { IdGenerator } from '../business/services/IdGenerator'
import {UserBusiness} from '../business/UserBusiness'
import { UserDatabase } from '../data/UserDatabase'

  const userBusiness = new UserBusiness(
        new IdGenerator(),
        new HashManager(),
        new Authenticator(),
        new UserDatabase()
    )

    export class UserController{
        async signup(req: Request, res: Response){
            try{              

                const {email, name, nickname, password, profilePicture} = req.body

                const input: UserInputDTO = {
                    name: name,
                    email: email,
                    password: password,
                    nickname: nickname,
                    profilePicture: profilePicture
                }

                const token = await userBusiness.createUser(input)

                res.status(200).send({token})

            } catch(error){
                res.status(error.statusCode || 400).send(error.message)
            }
        }

        async login(req: Request, res: Response){
            try{
                const {email, password} = req.body

                const input: LoginInputDTO ={
                    email: email,
                    password: password
                }

                const token = await userBusiness.insertUser(input)

                res.status(200).send({token})
            } catch(error){
                res.status(error.statusCode || 400).send(error.message)
            }
        }
    }
