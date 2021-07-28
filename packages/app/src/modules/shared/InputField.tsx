import React from "react";
import { Input } from "react-native-elements";
import { FieldProps } from "formik";

const errorStyle = {
    color: "red"
};

export class InputField extends React.Component<FieldProps<any>> {
    onChangeText = (text: string) => {
        const {
            form: { setFieldValue },
            field: { name }
        } = this.props;
        setFieldValue(name, text);
    };

    render() {
        const {
            field,
            form: { touched, errors },
            ...props
        } = this.props;
        const errorMsg = touched[field.name] && errors[field.name];

        return (
            <Input
                {...props}
                errorStyle={errorStyle}
                errorMessage={errorMsg as string}
                onChangeText={this.onChangeText}
                value={field.value}
            />
        );
    }
}
