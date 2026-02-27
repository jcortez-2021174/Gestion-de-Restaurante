    import mongoose from "mongoose";

    export const validateCreateCliente = [
    validateJWT,

    body("Nombre")
        .trim()
        .notEmpty().withMessage("El nombre es requerido")
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("El nombre solo puede contener letras"),

    body("Apellido")
        .trim()
        .notEmpty().withMessage("El apellido es requerido")
        .isLength({ min: 2, max: 50 })
        .withMessage("El apellido debe tener entre 2 y 50 caracteres")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("El apellido solo puede contener letras"),

    body("Correo")
        .trim()
        .notEmpty().withMessage("El correo es requerido")
        .isEmail()
        .withMessage("Debe ingresar un correo valido"),

    body("Telefono")
        .trim()
        .notEmpty().withMessage("El telefono es requerido")
        .isLength({ min: 8, max: 15 })
        .withMessage("El telefono debe tener entre 8 y 15 digitos")
        .matches(/^[0-9]+$/)
        .withMessage("El telefono solo puede contener numeros"),

    body("Direccion")
        .trim()
        .notEmpty().withMessage("La direccion es requerida")
        .isLength({ min: 5, max: 200 })
        .withMessage("La direccion debe tener entre 5 y 200 caracteres"),

    checkValidators,
    ];



    export const validateClienteId = [
    validateJWT,

    param("id")
        .isMongoId()
        .withMessage("No es un ID valido"),

    checkValidators,
    ];