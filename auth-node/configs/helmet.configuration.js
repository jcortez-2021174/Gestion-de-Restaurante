import { frameguard, hidePoweredBy } from "helmet";

export const helmetOptions = {
    contentSecurityPolicy:{
        useDefaults: true,
        directives:{
            defualtSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc:["'self'", 'data:', 'blob:'],
            connectSrc:["'self'"],
            fontSrc:["'self'"],
            objectSrc:["'none'"],
            baseUri:["'self'"],
            frameAcestors:["'none'"]
        }
    },
    hsts: false,
    frameguard:{action: 'deny'},
    hidePoweredBy: true,
    crossOriginalResourcePolicy: {policy: 'cross-origin'},
    crossOriginEmbedderPolicy: false,
};