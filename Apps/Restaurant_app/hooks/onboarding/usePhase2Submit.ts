// hooks/onboarding/usePhase2Submit.ts

import api from "@/services/apiClient";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-root-toast";

const clean = (val: any) => {
    if (val === null || val === undefined) return null;

    const str = String(val).trim();

    return str === "" ? null : str;
};

interface Props {
    phase2Data: any;
    isAllComplete: boolean;
}

export const usePhase2Submit = ({
    phase2Data,
    isAllComplete,
}: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const handlePhase2Submit = async () => {

        if (!isAllComplete || isSubmitting) return;

        const missingDeliveryMethodIndex = phase2Data.branches?.findIndex(
            (branch: any) => !branch.delivery_method,
        );

        if (
            missingDeliveryMethodIndex !== undefined &&
            missingDeliveryMethodIndex >= 0
        ) {
            setFeedbackMessage(
                `Please select a delivery method for Branch ${missingDeliveryMethodIndex + 1
                }.`,
            );

            setFeedbackVisible(true);

            return;
        }

        setIsSubmitting(true);

        try {
            const branches =
                phase2Data.branches?.map((b: any) => {
                    const isScheduled = b.delivery_method === "scheduled";

                    return {
                        name: clean(b.name),
                        address: clean(b.address),
                        latitude: b.latitude ?? null,
                        longitude: b.longitude ?? null,

                        delivery_method: clean(b.delivery_method),

                        pre_order_open_period: isScheduled
                            ? clean(b.pre_order_open_period)
                            : null,

                        final_order_time: isScheduled
                            ? clean(b.final_order_time)
                            : null,

                        operating_hours: !isScheduled
                            ? b.operating_hours?.map((h: any) => ({
                                day: h.day,
                                open_time: clean(h.open_time),
                                close_time: clean(h.close_time),
                                is_closed: h.is_closed ?? false,
                            })) ?? []
                            : [],
                    };
                }) ?? [];

            const payment = {
                bank: clean(phase2Data.payment?.bank),
                account_number: clean(
                    phase2Data.payment?.account_number,
                ),
                account_name: clean(
                    phase2Data.payment?.account_name,
                ),
                bvn: clean(phase2Data.payment?.bvn),
            };

            const formData = new FormData();

            formData.append(
                "registered_business_name",
                clean(
                    phase2Data.business_documents
                        ?.registered_business_name,
                ) ?? "",
            );

            formData.append(
                "business_type",
                clean(
                    phase2Data.business_documents?.business_type,
                ) ?? "",
            );

            formData.append(
                "tax_identification_number",
                clean(
                    phase2Data.business_documents
                        ?.tax_identification_number,
                ) ?? "",
            );

            formData.append(
                "rc_number",
                clean(
                    phase2Data.business_documents?.rc_number,
                ) ?? "",
            );

            formData.append("doctype", "cac");

            formData.append(
                "payment",
                JSON.stringify(payment),
            );

            formData.append(
                "branches",
                JSON.stringify(branches),
            );

            const documentUri =
                phase2Data.business_documents?.document_image;

            if (documentUri) {
                const extension =
                    documentUri.split(".").pop()?.toLowerCase() ||
                    "jpg";

                let mimeType = "image/jpeg";

                if (extension === "png") {
                    mimeType = "image/png";
                } else if (extension === "pdf") {
                    mimeType = "application/pdf";
                }

                formData.append(
                    "business_documents",
                    {
                        uri: documentUri,
                        name: `business-document.${extension}`,
                        type: mimeType,
                    } as any,
                );
            }

            // ==================== DEBUG LOGS ====================
            console.log("========== PHASE 2 PAYLOAD ==========");

            console.log("Business Documents:", {
                registered_business_name: clean(
                    phase2Data.business_documents?.registered_business_name,
                ),
                business_type: clean(
                    phase2Data.business_documents?.business_type,
                ),
                tax_identification_number: clean(
                    phase2Data.business_documents?.tax_identification_number,
                ),
                rc_number: clean(
                    phase2Data.business_documents?.rc_number,
                ),
                doctype: "cac",
            });

            console.log("Payment:", payment);

            console.log("Branches:", branches);

            console.log("Document URI:", documentUri);

            console.log("FormData:");

            (formData as any)._parts.forEach(([key, value]: any) => {
                console.log(`${key}:`, value);
            });

            console.log("=====================================");
            // ==================== END DEBUG LOGS ====================

            await api.post(
                "/accounts/onboard/phase2/",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                },
            );

            Toast.show(
                "Phase 2 submitted successfully!",
                {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                },
            );

            router.push("/superForm2/menu-items");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        feedbackVisible,
        feedbackMessage,
        setFeedbackVisible,
        handlePhase2Submit,
    };
};

export default usePhase2Submit;