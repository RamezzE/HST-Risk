import { Slot } from "expo-router";
import PageWrapper from "../../components/PageWrapper";
import FormWrapper from "../../components/FormWrapper";

const FormsLayout = () => {
    return (
        <PageWrapper>
            <FormWrapper>
                <Slot />
            </FormWrapper>
        </PageWrapper>
    );
};

export default FormsLayout;
