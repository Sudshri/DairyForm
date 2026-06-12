import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useAnimals, useDeleteAnimal } from '@/hooks/useAnimals';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/common/Table';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import Badge from '@/components/common/Badge';

const STATUS_COLOR = {
  active:   'green',
  dry:      'amber',
  sold:     'slate',
  deceased: 'red',
};

export default function AnimalList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useAnimals({ page, search: search || undefined });
  const { mutate: remove } = useDeleteAnimal();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search by name or tag…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Button onClick={() => navigate('/animals/new')}>
          <Plus size={16} /> Add Animal
        </Button>
      </div>

      <div className="card p-0">
        <Table>
          <Thead>
            <Th>Tag</Th><Th>Name</Th><Th>Type</Th><Th>Breed</Th><Th>Gender</Th><Th>Status</Th><Th>Actions</Th>
          </Thead>
          <Tbody>
            {isLoading
              ? <Tr><Td className="text-center py-10 text-slate-400" colSpan={7}>Loading…</Td></Tr>
              : data?.data?.map((a) => (
                  <Tr key={a.id} onClick={() => navigate(`/animals/${a.id}`)}>
                    <Td className="font-mono text-xs">{a.tag_number}</Td>
                    <Td className="font-medium">{a.name || '—'}</Td>
                    <Td className="capitalize">{a.type}</Td>
                    <Td>{a.breed || '—'}</Td>
                    <Td className="capitalize">{a.gender}</Td>
                    <Td><Badge color={STATUS_COLOR[a.status]}>{a.status}</Badge></Td>
                    <Td>
                      <button
                        onClick={(e) => { e.stopPropagation(); remove(a.id); }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </Td>
                  </Tr>
                ))
            }
          </Tbody>
        </Table>
        <Pagination meta={data?.meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
