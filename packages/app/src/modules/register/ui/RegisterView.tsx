import React from "react";
import { PureComponent } from "react";
import { FormikErrors, FormikProps, withFormik, Field } from "formik";
import { View, Button } from "react-native";

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
        const { handleSubmit } = this.props;

        return (
            <View style={{ marginTop: 200 }}>
                <Field
                    name="email"
                    placeholder="Email"
                    component={InputField}
                />
                <Field
                    name="password"
                    secureTextEntry={true}
                    placeholder="Password"
                    component={InputField}
                />
                <Button title="Submit" onPress={handleSubmit as any} />
            </View>
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
