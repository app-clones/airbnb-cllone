import { FieldProps } from "formik";
import { Form, Input } from "antd";
import React from "react";

export const InputField: React.FunctionComponent<FieldProps<any>> = ({
    field,
    form: { touched, errors },
    ...props
}) => {
    const errorMsg = touched[field.name] && errors[field.name];

    return (
        <Form.Item
            help={errorMsg}
            validateStatus={errorMsg ? "error" : undefined}
        >
            <Input {...field} {...props} />
        </Form.Item>
    );
};
