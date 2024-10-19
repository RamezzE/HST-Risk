import { Slot } from "expo-router";
import PageWrapper from "../../components/PageWrapper";

const MiscLayout = () => {
  return (
    <PageWrapper>
      <Slot />
    </PageWrapper>
  );
};

export default MiscLayout;
