"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
async function handler() {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello World' }),
    };
}
