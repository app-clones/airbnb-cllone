import { PureComponent } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { FormikErrors, FormikProps, withFormik } from "formik";

import { userValidationSchema } from "@abb/common";

interface FormValues {
    email: string;
    password: string;
}

interface Props {
    submit: (values: FormValues) => Promise<FormikErrors<FormValues | null>>;
}

class C extends PureComponent<FormikProps<FormValues> & Props> {
    render() {
        const {
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            errors
        } = this.props;

        return (
            <form
                style={{
                    display: "flex"
                }}
                onSubmit={handleSubmit}
            >
                <div style={{ width: 400, margin: "auto", marginTop: 50 }}>
                    <Form.Item
                        help={touched.email && errors.email ? errors.email : ""}
                        validateStatus={
                            touched.email && errors.email ? "error" : ""
                        }
                    >
                        <Input
                            name="email"
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Form.Item>
                    <Form.Item
                        help={
                            touched.password && errors.password
                                ? errors.password
                                : ""
                        }
                        validateStatus={
                            touched.password && errors.password ? "error" : ""
                        }
                    >
                        <Input.Password
                            name="password"
                            prefix={
                                <LockOutlined className="site-form-item-icon" />
                            }
                            type="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Form.Item>
                    <Form.Item>
                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            style={{ borderRadius: 5 }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Register
                        </Button>
                    </Form.Item>
                    Already a member? <a href="">Login</a>
                </div>
            </form>
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
