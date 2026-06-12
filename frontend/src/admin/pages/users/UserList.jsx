import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setNotification } from '@/store/redux/uiSlice';
import DataTable from '@/admin/components/DataTable';
import { userService } from '@/services/adminService';
import { formatDate } from '@/utils/formatters';
import { clsx } from 'clsx';

export default function UserList() {
  const qc       = useQueryClient();
  const dispatch = useDispatch();
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState('');
  const [role,   setRole]   = useState('customer');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, search, role],
    queryFn: () => userService.list({ page, per_page: 15, search: search || undefined, role })
                   .then((r) => r.data),
    keepPreviousData: true,
  });

  const toggleMut = useMutation({
    mutationFn: (id) => userService.toggleStatus(id),
    onSuccess: () => {
      qc.invalidateQueries(['admin', 'users']);
      dispatch(setNotification({ type: 'success', message: 'User status updated' }));
    },
  });

  const columns = [
    {
      key: 'name', label: 'User',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 font-bold text-sm
                          flex items-center justify-center shrink-0">
            {v?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="font-medium text-slate-800 text-sm">{v}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', render: (v) => <span className="font-mono text-xs">{v}</span> },
    {
      key: 'role', label: 'Role',
      render: (v) => (
        <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold capitalize',
          v === 'admin' ? 'bg-violet-100 text-violet-700' :
          v === 'delivery_agent' ? 'bg-blue-100 text-blue-700' :
          'bg-slate-100 text-slate-600')}>
          {v?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'is_active', label: 'Status',
      render: (v) => (
        <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-semibold',
          v ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500')}>
          {v ? 'Active' : 'Suspended'}
        </span>
      ),
    },
    {
      key: 'created_at', label: 'Joined',
      render: (v) => <span className="text-xs text-slate-500">{formatDate(v)}</span>,
    },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); toggleMut.mutate(id); }}
          className={clsx(
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors',
            row.is_active
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          )}
        >
          {row.is_active ? 'Suspend' : 'Activate'}
        </button>
      ),
    },
  ];

  const users = data?.data ?? MOCK_USERS;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display text-slate-800">Users</h2>
          <p className="text-sm text-slate-400">{data?.meta?.total ?? users.length} users</p>
        </div>
      </div>

      {/* Role filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {['customer', 'admin', 'delivery_agent'].map((r) => (
          <button key={r} onClick={() => { setRole(r); setPage(1); }}
            className={clsx(
              'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all',
              role === r
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
            )}>
            {r.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={isLoading}
        meta={data?.meta}
        onPage={setPage}
        onSearch={setSearch}
        emptyText="No users found"
      />
    </div>
  );
}

const MOCK_USERS = [
  { id:1,  name:'Ramesh Kumar',  email:'ramesh@example.com',  phone:'9876543210', role:'customer',       is_active:true,  created_at:'2026-01-15' },
  { id:2,  name:'Priya Sharma',  email:'priya@example.com',   phone:'9876543211', role:'customer',       is_active:true,  created_at:'2026-02-20' },
  { id:3,  name:'Admin',         email:'admin@dairyform.local',phone:'9000000001', role:'admin',          is_active:true,  created_at:'2024-01-01' },
  { id:4,  name:'Anita Desai',   email:'anita@example.com',   phone:'9876543212', role:'customer',       is_active:false, created_at:'2026-03-10' },
  { id:5,  name:'Delivery Agent',email:'agent1@dairyform.local',phone:'9000000002',role:'delivery_agent', is_active:true,  created_at:'2024-06-01' },
];
