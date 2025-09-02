package com.example.negocio.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ExactlyOneNotNullValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ExactlyOneNotNull {
    String message() default "Se debe especificar un idProducto o un idPromocion, pero no ambos.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
