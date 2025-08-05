import ContentSection from "@/features/settings/components/content-section";
import ForceRechargeForm from "../components/force-recharge-form";

export default function ForceRecharge() {
    return (
        <ContentSection title="Force recharge" desc="Force recharge a user's plan">
            <ForceRechargeForm />
        </ContentSection>
    )
}