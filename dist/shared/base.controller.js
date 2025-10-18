"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const config_1 = require("../config");
const jwt = require("jsonwebtoken");
class BaseController {
    constructor() { }
    getUserIdFromToken(authorization) {
        if (!authorization)
            return null;
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, config_1.SECRET);
        return decoded.id;
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map