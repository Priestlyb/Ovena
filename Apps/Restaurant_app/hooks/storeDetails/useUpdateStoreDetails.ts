import { BUSINESS_PROFILE_QUERY_KEY } from "@/hooks/useBusinessProfile";
import api from "@/services/apiClient";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import axios, { AxiosError } from "axios";


export interface UpdateStoreDetailsPayload {
    business_name: string;
    business_type: string;

    business_address?: string;
    phone_number?: string;
    email?: string;

    password?: string;

    business_logo?: {
        uri: string;
        name?: string;
        type?: string;
    } | null;

    business_image?: {
        uri: string;
        name?: string;
        type?: string;
    } | null;
}


export interface UpdateStoreDetailsResponse {
    success?: boolean;
    message?: string;
    detail?: string;
    data?: any;
}


/* ---------------- FORM DATA BUILDER ---------------- */

const buildFormData = (
    payload: UpdateStoreDetailsPayload
) => {
    const formData = new FormData();


    formData.append(
        "business_name",
        payload.business_name
    );


    formData.append(
        "business_type",
        payload.business_type
    );


    if (payload.business_address) {
        formData.append(
            "business_address",
            payload.business_address
        );
    }


    if (payload.phone_number) {
        formData.append(
            "phone_number",
            payload.phone_number
        );
    }


    if (payload.email) {
        formData.append(
            "email",
            payload.email
        );
    }


    if (payload.password) {
        formData.append(
            "password",
            payload.password
        );
    }



    /* ---------------- LOGO ---------------- */

    if (payload.business_logo?.uri) {
        formData.append(
            "business_logo",
            {
                uri: payload.business_logo.uri,
                name:
                    payload.business_logo.name ||
                    "logo.jpg",
                type:
                    payload.business_logo.type ||
                    "image/jpeg",
            } as any
        );
    }



    /* ---------------- BUSINESS IMAGE ---------------- */

    if (payload.business_image?.uri) {
        formData.append(
            "business_image",
            {
                uri: payload.business_image.uri,
                name:
                    payload.business_image.name ||
                    "business.jpg",
                type:
                    payload.business_image.type ||
                    "image/jpeg",
            } as any
        );
    }


    return formData;
};



/* ---------------- API ---------------- */

const updateStoreDetails = async (
    payload: UpdateStoreDetailsPayload
): Promise<UpdateStoreDetailsResponse> => {

    const formData = buildFormData(payload);


    const response = await api.patch(
        "/business/update/",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );


    return response.data;
};




/* ---------------- MUTATION ---------------- */

export const useUpdateStoreDetails = () => {

    const queryClient = useQueryClient();


    return useMutation<
        UpdateStoreDetailsResponse,
        AxiosError<{
            detail?: string;
            message?: string;
        }>,
        UpdateStoreDetailsPayload
    >({

        mutationFn: updateStoreDetails,


        onSuccess: async (data) => {

            console.log(
                "[useUpdateStoreDetails] Success:",
                data
            );


            await queryClient.refetchQueries({
                queryKey:
                    BUSINESS_PROFILE_QUERY_KEY,
            });
        },



        onError: (error) => {

            if (axios.isAxiosError(error)) {

                console.log(
                    "[useUpdateStoreDetails] API Error:",
                    error.response?.data
                );

            } else {

                console.log(
                    "[useUpdateStoreDetails] Error:",
                    error
                );

            }
        },

    });
};