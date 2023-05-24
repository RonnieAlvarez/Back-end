import { Router } from "express";
import jwt from "jsonwebtoken";
import config from "../../../../config/config.js";

const PRIVATE_KEY = config.jwtKey;
export default class CustomRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }
    init() {} //Esta inicialilzacion se usa para las clases heredadas.

    get(path, policies, ...callbacks) {

        this.router.get(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        );
    }

    post(path, policies, ...callbacks) {
        this.router.post(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        );
    }

    put(path, policies, ...callbacks) {
        this.router.put(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        );
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        );
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (req, res, next) => {
            if (typeof callback !== "function") {
                return next();
            }
            try {
                await callback.apply(this, [req, res, next]);
            } catch (error) {
                res.status(500).send(error);
            }
        });
    }

    generateCustomResponses = (req, res, next) => {
        //Custom responses
        res.sendSuccess = (payload) => res.status(200).send({ status: "Success", payload });
        res.sendInternalServerError = (error) => res.status(500).send({ status: "Error", error });
        res.sendClientError = (error) =>
            res.status(400).send({
                status: "Client Error, Bad request from client.",
                error,
            });
        res.sendUnauthorizedError = (error) =>
            res.status(401).send({ error: "User not authenticated or missing token." });
        res.sendForbiddenError = (error) =>
            res.status(403).send({
                error: "Token invalid or user with no access, Unauthorized please check your roles!",
            });
        next();
    };

    handlePolicies({ policies }) {
        return (req, res, next) => {
            if (policies.includes("USER")) {
                return next(); // anyone can access
            }
            const authHeader = req.headers.cookie;
            if (!authHeader) {
                return res.status(401).send({ error: "User not authenticated or missing token." });
            }
            const token = authHeader.split("=")[1]; //Se hace el split para retirar la palabra Bearer.
            jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
                if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!" });
                let user = credentials.user;
                if (!policies.includes(user.roll))
                    return res.status(403).send({
                        error: "El usuario no tiene privilegios, revisa tus roles!",
                    });
                next();
            });
        };
    }
}
