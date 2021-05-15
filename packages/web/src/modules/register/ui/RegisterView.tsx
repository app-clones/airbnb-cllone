import { PureComponent } from "react";
import { Form as AntForm, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { FormikErrors, FormikProps, withFormik, Field, Form } from "formik";

import { userValidationSchema } from "@abb/common";
import { InputField } from "../../shared/InputField";

interface FormValues {
    email: string;
    password: string;
}

interface Props {
    submit: (values: FormValues) => Promise<FormikErrors<FormValues | null>>;
}

class C extends PureComponent<FormikProps<FormValues> & Props> {
    render() {
        return (
            <Form
                style={{
                    display: "flex"
                }}
            >
                <div style={{ width: 400, margin: "auto", marginTop: 50 }}>
                    <Field
                        name="email"
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Email"
                        component={InputField}
                    />
                    <Field
                        name="password"
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                        component={InputField}
                        style={{ marginBottom: "0px" }}
                    />
                    <AntForm.Item>
                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </AntForm.Item>
                    <AntForm.Item>
                        <Button
                            style={{ borderRadius: 5 }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Register
                        </Button>
                    </AntForm.Item>
                    Already a member? <a href="">Login</a>
                </div>
            </Form>
        );
    }
}

export const RegisterView = withFormik<Props, FormValues>({
    validationSchema: userValidationSchema,
    mapPropsToValues: () => ({ email: "", password: "" }),
    handleSubmit: async (values, { props, setErrors }) => {
        const errors = await props.submit(values);
        if (errors) {
            setErrors(errors);
        }
    }
})(C);
