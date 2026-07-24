import { unformatPrice } from "./formatPrice";
import { cleanText } from "./text";

/* =========================================
   TYPES
========================================= */
type BaseItem = {
  name: string;
  description: string;
  price: number;
  image: string | null;
};

type VariantOption = {
  name: string;
  price_diff: number | string;
};

type VariantGroup = {
  name: string;
  is_required: boolean;
  options: VariantOption[];
};

type ImageValue =
  | {
    uri: string;
    uploadedUrl?: string;
  }
  | string
  | null;

type Addon = {
  price: number | string;
  name: string;
  description: string;

  image: ImageValue;

  base_item?: {
    name: string;
    description: string;
    price: number | string;
    image: ImageValue;
  };
};

type AddonGroup = {
  name: string;
  is_required: boolean;
  max_selection: number | string;
  addons: Addon[];
};

type BuildMenuPayloadParams = {
  name: string;
  description: string;
  price: string;
  category: string;
  isActive: boolean;

  productImage?: {
    uri: string;
    uploadedUrl?: string;
  } | null;

  cleanVariants: VariantGroup[];
  cleanAddons: AddonGroup[];

  useMergeBase?: boolean;

  manualBaseName?: string;
  manualBaseDescription?: string;
  manualBasePrice?: string;
};

/* =========================================
   HELPER
========================================= */
const resolveImageUrl = (
  image: ImageValue | undefined,
): string | null => {
  if (!image) return null;

  /* already uploaded */
  if (typeof image === "string") {
    return image;
  }

  /* uploaded image url */
  if (image.uploadedUrl) {
    return image.uploadedUrl;
  }

  /* local fallback */
  if (image.uri) {
    return image.uri;
  }

  return null;
};

/* =========================================
   MAIN BUILDER
========================================= */
export const buildMenuPayload = ({
  name,
  description,
  price,
  category,
  isActive,
  productImage,
  cleanVariants,
  cleanAddons,
  useMergeBase = true,
  manualBaseName = "",
  manualBaseDescription = "",
  manualBasePrice = "",
}: BuildMenuPayloadParams) => {
  const cleanedName =
    cleanText(name);

  const cleanedDescription =
    cleanText(description);

  const parsedPrice =
    unformatPrice(price);

  /* =========================================
     PRODUCT IMAGE
  ========================================= */
  const imageUrl =
    resolveImageUrl(productImage);

  /* =========================================
     BASE ITEM
  ========================================= */
  const baseItem: BaseItem =
    useMergeBase
      ? {
        name: cleanedName,
        description:
          cleanedDescription,
        price: parsedPrice,
        image: imageUrl,
      }
      : {
        name: cleanText(
          manualBaseName,
        ),

        description: cleanText(
          manualBaseDescription,
        ),

        price: unformatPrice(
          manualBasePrice,
        ),

        image: null,
      };

  /* =========================================
     MENU OBJECT
  ========================================= */
  const menuObject = {
    name: "Main Menu",

    description: "",

    is_active: isActive,

    categories: [
      {
        name: cleanText(category),

        sort_order: 0,

        items: [
          {
            custom_name:
              cleanedName,

            description:
              cleanedDescription,

            price: parsedPrice,

            image: imageUrl,

            base_item: baseItem,

            /* ================================
               VARIANTS
            ================================= */
            variant_groups:
              cleanVariants.map(
                (g) => ({
                  name: cleanText(
                    g.name,
                  ),

                  is_required:
                    g.is_required,

                  options:
                    g.options.map(
                      (o) => ({
                        name: cleanText(
                          o.name,
                        ),

                        price_diff:
                          unformatPrice(
                            String(
                              o.price_diff ||
                              0,
                            ),
                          ),
                      }),
                    ),
                }),
              ),

            /* ================================
               ADDONS
            ================================= */
            addon_groups:
              cleanAddons.map(
                (g) => ({
                  name: cleanText(
                    g.name,
                  ),

                  is_required:
                    g.is_required,

                  max_selection:
                    Number(
                      g.max_selection ||
                      0,
                    ),

                  addons:
                    g.addons.map(
                      (a) => {
                        const addonImage =
                          resolveImageUrl(
                            a.image,
                          ) ||
                          resolveImageUrl(
                            a.base_item
                              ?.image,
                          );

                        return {
                          price:
                            unformatPrice(
                              String(
                                a.price ||
                                0,
                              ),
                            ),

                          image:
                            addonImage,

                          base_item: {
                            name: cleanText(
                              a
                                .base_item
                                ?.name ||
                              a.name,
                            ),

                            description:
                              cleanText(
                                a
                                  .base_item
                                  ?.description ||
                                a.description ||
                                "",
                              ),

                            price:
                              unformatPrice(
                                String(
                                  a
                                    .base_item
                                    ?.price ||
                                  a.price ||
                                  0,
                                ),
                              ),

                            image:
                              addonImage,
                          },
                        };
                      },
                    ),
                }),
              ),
          },
        ],
      },
    ],
  };

  /* =========================================
     FINAL PAYLOAD
  ========================================= */
  return {
    menus: [menuObject],
  };
};