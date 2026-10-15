// utils/orders/normalizeOrders.ts

export const normalizeOrders = (orders: any) => {
  let data = [];

  if (Array.isArray(orders)) {
    data = orders;
  } else if (Array.isArray(orders?.results)) {
    data = orders.results;
  } else if (Array.isArray(orders?.data)) {
    data = orders.data;
  }

  return data.map((item: any) => {

    return {
      id: item.id,
      product_name: item.product_name,
      product_image: item.product_image,
      grand_total: item.grand_total,
      branch: item.branch,
      location: item.location,
      status: item.status,
      created_at: item.created_at,
      ...item,
    };
  });
};