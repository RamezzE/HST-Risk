import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

const FormWrapper = ({ children }) => {
    return (
        <KeyboardAwareScrollView
            bottomOffset={175}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            bounces={true}
            contentContainerStyle={{ flexGrow: 1 }}
            overScrollMode="never"
        >
            {children}

        </KeyboardAwareScrollView>
    )
}

export default FormWrapper
