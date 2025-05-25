"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAsyncErrors = void 0;
const CatchAsyncErrors = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
exports.CatchAsyncErrors = CatchAsyncErrors;
