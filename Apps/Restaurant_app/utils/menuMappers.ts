import { cleanText, parsePrice, safeNumber } from "./editMenuHelpers";

export function mapMenuResponse(
    menus: any[],
    menuId: string,
    categoryId: string,
    itemId: string
) {
    let foundMenu: any = null;
    let foundCategory: any = null;
    let foundItem: any = null;

    for (const menu of menus) {
        if (String(menu.id) !== String(menuId)) continue;

        foundMenu = menu;

        for (const category of menu.categories ?? []) {
            if (String(category.id) !== String(categoryId)) continue;

            foundCategory = category;

            foundItem = (category.items ?? []).find(
                (item: any) =>
                    String(item.id) === String(itemId) ||
                    String(item.base_item_id) === String(itemId)
            );

            break;
        }

        break;
    }

    return {
        foundMenu,
        foundCategory,
        foundItem,
    };
}

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

                                // Never send a local file:// URI
                                image:
                                    image?.uploadedUrl ??
                                    (image?.uri?.startsWith("http") ? image.uri : null),

                                base_item: baseItemId
                                    ? {
                                        id: baseItemId,
                                    }
                                    : undefined,

                                variant_groups: (variantGroups || []).map((g: any) => ({
                                    id: g.id,
                                    name: cleanText(g.name),
                                    is_required: !!g.is_required,

                                    options: (g.options || []).map((o: any) => ({
                                        id: o.id,
                                        name: cleanText(o.name),
                                        price_diff: safeNumber(o.price_diff),
                                    })),
                                })),

                                addon_groups: (addonGroups || []).map((g: any) => ({
                                    id: g.id,
                                    name: cleanText(g.name),
                                    is_required: !!g.is_required,
                                    max_selection: Number(g.max_selection || 0),

                                    addons: (g.addons || []).map((a: any) => ({
                                        id: a.id,
                                        name: cleanText(a.name),
                                        price: safeNumber(a.price),

                                        base_item: a.base_item_id
                                            ? {
                                                id: a.base_item_id,
                                            }
                                            : undefined,

                                        image:
                                            a.image?.uploadedUrl ??
                                            (a.image?.uri?.startsWith("http")
                                                ? a.image.uri
                                                : null),
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