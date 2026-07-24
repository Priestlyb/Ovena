import {
    AvailabilityItem,
    MenuAPIResponse,
    MenuItem,
} from "@/types/menu";
import {
    cleanText,
    parsePrice,
    safeNumber,
} from "./editMenuHelpers";

/**
 * Finds a menu, category and item from the nested menu response.
 * Used by Edit Menu.
 */
export function mapMenuResponse(
    menus: any[],
    menuId: string,
    categoryId: string,
    baseItemId: string
) {
    let foundMenu: any = null;
    let foundCategory: any = null;
    let foundItem: any = null;

    menus.forEach((m: any) => {
        if (String(m.id) !== String(menuId)) return;

        foundMenu = m;

        m.categories?.forEach((c: any) => {
            if (String(c.id) !== String(categoryId)) return;

            foundCategory = c;

            c.items?.forEach((i: any) => {
                if (
                    String(i.base_item_id) ===
                    String(baseItemId)
                ) {
                    foundItem = i;
                }
            });
        });
    });

    return {
        foundMenu,
        foundCategory,
        foundItem,
    };
}

/**
 * Builds the payload for updating a menu.
 * Used by Edit Menu.
 */
export function buildUpdatePayload({
    menuId,
    menuName,
    isActive,
    categoryId,
    categoryName,
    itemId,
    name,
    description,
    price,
    image,
    baseItemId,
    variantGroups,
    addonGroups,
}: any) {
    return {
        menus: [
            {
                id: menuId,
                name: cleanText(menuName),
                is_active: isActive,

                categories: [
                    {
                        id: categoryId,
                        name: cleanText(categoryName),

                        items: [
                            {
                                id: itemId,
                                custom_name: cleanText(name),
                                description: cleanText(description),
                                price: parsePrice(price),

                                image:
                                    image?.uploadedUrl ??
                                    image?.uri ??
                                    null,

                                base_item: baseItemId
                                    ? { id: baseItemId }
                                    : undefined,

                                variant_groups: (
                                    variantGroups || []
                                ).map((g: any) => ({
                                    id: g.id,
                                    name: cleanText(g.name),
                                    is_required:
                                        !!g.is_required,

                                    options: (
                                        g.options || []
                                    ).map((o: any) => ({
                                        id: o.id,
                                        name: cleanText(
                                            o.name
                                        ),
                                        price_diff:
                                            safeNumber(
                                                o.price_diff
                                            ),
                                    })),
                                })),

                                addon_groups: (
                                    addonGroups || []
                                ).map((g: any) => ({
                                    id: g.id,
                                    name: cleanText(g.name),
                                    is_required:
                                        !!g.is_required,
                                    max_selection: Number(
                                        g.max_selection || 0
                                    ),

                                    addons: (
                                        g.addons || []
                                    ).map((a: any) => ({
                                        id: a.id,
                                        name: cleanText(
                                            a.name
                                        ),
                                        price: safeNumber(
                                            a.price
                                        ),

                                        base_item:
                                            a.base_item_id
                                                ? {
                                                    id: a.base_item_id,
                                                }
                                                : undefined,

                                        image:
                                            a.image
                                                ?.uploadedUrl ??
                                            a.image?.uri ??
                                            null,
                                    })),
                                })),
                            },
                        ],
                    },
                ],
            },
        ],
    };
}

/**
 * Maps the menu API + availability API into MenuItem[]
 * Used by useFoodMenu.
 */
export function mapMenuItems(
    menuData: any,
    availabilityData: any
): MenuItem[] {
    const availabilityRaw: AvailabilityItem[] =
        Array.isArray(availabilityData)
            ? availabilityData
            : availabilityData?.results?.data ||
              availabilityData?.results ||
              availabilityData?.data ||
              [];

    const availabilityMap = new Map<
        number,
        boolean
    >();

    availabilityRaw.forEach((item) => {
        availabilityMap.set(
            item.id,
            item.is_available
        );
    });

    const rawMenus: MenuAPIResponse[] =
        Array.isArray(menuData)
            ? menuData
            : menuData?.menus || [];

    const items: MenuItem[] = [];

    rawMenus.forEach((menu) => {
        menu.categories?.forEach((category) => {
            category.items?.forEach((item) => {
                if (!item?.base_item_id) return;

                const available =
                    availabilityMap.get(
                        item.base_item_id
                    ) ??
                    item.is_available ??
                    false;

                items.push({
                    ...item,

                    id: String(item.id),

                    base_item_id: String(
                        item.base_item_id
                    ),

                    custom_name:
                        item.custom_name ??
                        "Unnamed",

                    description:
                        item.description ?? "",

                    image: item.image ?? "",

                    price: `₦${Number(
                        item.price ?? 0
                    ).toLocaleString()}`,

                    is_available: available,

                    inStock: available,

                    variant_groups:
                        item.variant_groups ?? [],

                    addon_groups:
                        item.addon_groups ?? [],

                    selected: false,

                    menuId: String(menu.id),

                    categoryId: String(
                        category.id
                    ),

                    categoryName:
                        category.name ?? "",

                    menuName:
                        menu.name ?? "",
                });
            });
        });
    });

    return items;
}