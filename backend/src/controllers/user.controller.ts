import { Request, Response, NextFunction } from "express";

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    console.log('Getting all Users');
    res.send('Getting all Users');
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
    console.log('Creating a new User');
    res.send('Creating a new User');
}