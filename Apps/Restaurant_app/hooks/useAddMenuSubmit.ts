// hooks/useAddMenuSubmit.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MENU_QUERY_KEY } from "@/hooks/foodTab/useMenu";

import api from "@/services/apiClient";

import { validateMenuForm } from "@/utils/addmenuValidation";
import { buildMenuPayload } from "@/utils/payload";


/* =========================================
   TYPES
========================================= */

type FeedbackVariant =
  | "success"
  | "error"
  | "warning"
  | "info";


type ImageState = {
  uri: string;
  uploadedUrl?: string;
} | null;


type UploadImageFn = (
  uri: string
) => Promise<string | null>;



type Params = {
  category: string;

  showAddCategory: boolean;

  newCategory: string;


  name: string;

  description: string;

  price: string;


  isActive: boolean;


  useMergeBase: boolean;


  manualBaseName: string;

  manualBaseDescription: string;

  manualBasePrice: string;


  productImage: ImageState;


  cleanVariants: any[];

  cleanAddons: any[];


  uploadImage: UploadImageFn;


  showFeedback: (
    message: string,
    variant: FeedbackVariant
  ) => void;


  onSuccess?: () => void;
};



/* =========================================
   UPLOAD PRODUCT IMAGE
========================================= */

const uploadProductImage = async (
  image: ImageState,
  uploadImage: UploadImageFn
) => {

  if (!image) {
    return null;
  }


  // Already uploaded
  if (image.uploadedUrl) {
    return image;
  }


  const uploadedUrl =
    await uploadImage(
      image.uri
    );


  if (!uploadedUrl) {
    throw new Error(
      "Product image upload failed"
    );
  }


  return {
    ...image,
    uploadedUrl,
  };

};



/* =========================================
   UPLOAD ADDON IMAGES
========================================= */

const uploadAddonImages = async (
  addons: any[],
  uploadImage: UploadImageFn
) => {

  return Promise.all(

    addons.map(async (group) => {

      return {

        ...group,


        addons: await Promise.all(

          group.addons.map(
            async (addon: any) => {


              if (!addon.image) {
                return addon;
              }



              // Already uploaded
              if (
                typeof addon.image === "object" &&
                addon.image.uploadedUrl
              ) {

                return {
                  ...addon,

                  image:
                    addon.image.uploadedUrl,

                  base_item: {
                    ...addon.base_item,

                    image:
                      addon.image.uploadedUrl,
                  },
                };

              }



              const uri =
                typeof addon.image === "string"
                  ? addon.image
                  : addon.image.uri;



              if (!uri) {
                return addon;
              }



              const uploadedUrl =
                await uploadImage(uri);



              if (!uploadedUrl) {
                throw new Error(
                  `Addon image upload failed: ${addon.name}`
                );
              }



              return {

                ...addon,


                image:
                  uploadedUrl,


                base_item: {

                  ...addon.base_item,

                  image:
                    uploadedUrl,

                },

              };

            }
          )

        ),

      };

    })

  );

};





/* =========================================
   HOOK
========================================= */

export function useAddMenuSubmit({

  category,

  showAddCategory,

  newCategory,


  name,

  description,

  price,


  isActive,


  useMergeBase,


  manualBaseName,

  manualBaseDescription,

  manualBasePrice,


  productImage,


  cleanVariants,

  cleanAddons,


  uploadImage,


  showFeedback,


  onSuccess,


}: Params) {


  const queryClient =
    useQueryClient();



  const mutation =
    useMutation({



      mutationFn: async () => {


        console.log(
          "Starting image uploads..."
        );



        /* =========================
           PRODUCT IMAGE
        ========================= */

        const uploadedProductImage =
          await uploadProductImage(
            productImage,
            uploadImage
          );



        /* =========================
           ADDON IMAGES
        ========================= */

        const uploadedAddons =
          await uploadAddonImages(
            cleanAddons,
            uploadImage
          );



        console.log(
          "Images uploaded successfully"
        );



        /* =========================
           BUILD PAYLOAD
        ========================= */

        const payload =
          buildMenuPayload({

            name,

            description,

            price,

            category,


            isActive,


            productImage:
              uploadedProductImage,


            cleanVariants,


            cleanAddons:
              uploadedAddons,


            useMergeBase,


            manualBaseName,


            manualBaseDescription,


            manualBasePrice,

          });



        console.log(
          "FINAL MENU PAYLOAD:",
          JSON.stringify(
            payload,
            null,
            2
          )
        );



        const response =
          await api.post(
            "/accounts/onboard/phase3/",
            payload
          );



        return response.data;

      },



      onSuccess: async () => {


        console.log(
          "MENU CREATED SUCCESSFULLY"
        );



        /**
         * Update React Query cache
         */
        await queryClient.invalidateQueries({
          queryKey: MENU_QUERY_KEY,
        });



        /**
         * Force fresh menu fetch
         */
        await queryClient.refetchQueries({
          queryKey: MENU_QUERY_KEY,
        });



        showFeedback(
          "Menu item added successfully",
          "success"
        );



        onSuccess?.();

      },



      onError: (error: any) => {


        const backendError =
          error?.response?.data;



        console.log(
          "ADD MENU ERROR:",
          JSON.stringify(
            backendError,
            null,
            2
          )
        );



        const message =
          backendError
            ? typeof backendError === "string"
              ? backendError
              : JSON.stringify(
                backendError
              )
            : error?.message ||
            "Something went wrong";



        showFeedback(
          message,
          "error"
        );

      },


    });





  const handleSubmit = () => {


    const error =
      validateMenuForm({

        category,

        showAddCategory,

        newCategory,


        name,

        price,


        useMergeBase,


        manualBaseName,


        manualBasePrice,

      });



    if (error) {

      showFeedback(
        error,
        "error"
      );

      return;

    }



    mutation.mutate();

  };





  return {

    handleSubmit,

    isSubmitting:
      mutation.isPending,

  };

}