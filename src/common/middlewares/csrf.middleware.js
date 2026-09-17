import crypto from "crypto";
import { ForbiddenException } from "../helpers/exception.helper.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrfProtection = (req, res, next) => {
    const cookieToken = req.cookies?.csrfToken;
    const hasAuthCookies = Boolean(req.cookies?.accessToken || req.cookies?.refreshToken);

    if (!cookieToken) {
        res.cookie("csrfToken", crypto.randomUUID(), {
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
    }

    if (SAFE_METHODS.has(req.method) || !hasAuthCookies) {
        return next();
    }

    const requestToken = req.headers["x-csrf-token"];

    if (!cookieToken || requestToken !== cookieToken) {
        throw new ForbiddenException("CSRF token không hợp lệ");
    }

    next();
};
