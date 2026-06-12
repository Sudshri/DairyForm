import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api/orderApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import { clearCart } from '@/store/redux/cartSlice';

const MOCK_ORDERS = [
  {
    id:'DF1024', date:'2026-06-04', status:'pending', total:180,
    items:[{ name:'Fresh Paneer', qty:1, price:180 }],
    address:'123 Farm Rd, Hadapsar, Pune', payment:'UPI',
  },
  {
    id:'DF1023', date:'2026-06-03', status:'dispatched', total:850,
    items:[{ name:'Pure A2 Ghee', qty:1, price:850 }],
    address:'123 Farm Rd, Hadapsar, Pune', payment:'UPI',
    tracking:{ carrier:'BlueDart', awb:'BD8923456', eta:'Jun 5' },
  },
  {
    id:'DF1022', date:'2026-06-01', status:'delivered', total:245,
    items:[{ name:'A2 Full Cream Milk', qty:2, price:65 }, { name:'Butter', qty:1, price:115 }],
    address:'123 Farm Rd, Hadapsar, Pune', payment:'Cash on Delivery',
  },
  {
    id:'DF1021', date:'2026-05-28', status:'delivered', total:130,
    items:[{ name:'A2 Milk', qty:2, price:65 }],
    address:'123 Farm Rd, Hadapsar, Pune', payment:'UPI',
  },
  {
    id:'DF1020', date:'2026-05-20', status:'cancelled', total:90,
    items:[{ name:'Probiotic Dahi', qty:1, price:90 }],
    address:'123 Farm Rd, Hadapsar, Pune', payment:'Card',
  },
];

const KEYS = {
  all:    ['orders'],
  list:   (p) => ['orders', 'list', p],
  detail: (id) => ['orders', id],
};

export function useOrders(params = {}) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn:  async () => {
      try { return (await orderApi.list(params)).data; }
      catch {
        let filtered = [...MOCK_ORDERS];
        if (params.status) filtered = filtered.filter((o) => o.status === params.status);
        return { data: filtered, meta: { total: filtered.length, current_page: 1, last_page: 1 } };
      }
    },
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn:  async () => {
      try { return (await orderApi.get(id)).data; }
      catch { return MOCK_ORDERS.find((o) => o.id === id) ?? null; }
    },
    enabled: !!id,
  });
}

export function usePlaceOrder() {
  const qc       = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data) => orderApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries(KEYS.all);
      dispatch(clearCart());
      dispatch(setNotification({ type: 'success', message: 'Order placed successfully! 🎉' }));
      return res;
    },
    onError: () => {
      dispatch(setNotification({ type: 'error', message: 'Failed to place order. Please try again.' }));
    },
  });
}

export function useCancelOrder() {
  const qc       = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => orderApi.cancel(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries(KEYS.all);
      qc.invalidateQueries(KEYS.detail(id));
      dispatch(setNotification({ type: 'success', message: 'Order cancelled' }));
    },
  });
}
