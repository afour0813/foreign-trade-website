'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Eye, Search, Mail, Phone, Building2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  product_id: string | null;
  status: string;
  is_read: boolean;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  replied: '已回复',
  closed: '已关闭',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchInquiries = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/inquiries?${params.toString()}`, { credentials: 'include' });
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('获取询盘失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, [statusFilter]);

  const handleView = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDetailOpen(true);
    if (!inquiry.is_read) {
      try {
        await fetch('/api/admin/inquiries', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          credentials: 'include', body: JSON.stringify({ id: inquiry.id, is_read: true }),
        });
        fetchInquiries();
      } catch { /* ignore */ }
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/inquiries', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ id, status }),
      });
      setDetailOpen(false);
      fetchInquiries();
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此询盘吗？')) return;
    try {
      await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE', credentials: 'include' });
      fetchInquiries();
    } catch (error) {
      console.error('删除询盘失败:', error);
    }
  };

  const filtered = inquiries.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(search.toLowerCase()))
  );

  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-50 text-yellow-600',
      processing: 'bg-blue-50 text-blue-600',
      replied: 'bg-green-50 text-green-600',
      closed: 'bg-gray-100 text-gray-400',
    };
    return styles[status] || styles.pending;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-orange-500" /> 询盘管理
          {unreadCount > 0 && (
            <span className="text-sm font-normal bg-red-500 text-white px-2 py-0.5 rounded-full">
              {unreadCount} 条未读
            </span>
          )}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="按姓名、邮箱或公司搜索..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500">
          <option value="">全部状态</option>
          <option value="pending">待处理</option>
          <option value="processing">处理中</option>
          <option value="replied">已回复</option>
          <option value="closed">已关闭</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">加载中...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">暂无询盘。</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发件人</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">公司</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">主题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${!item.is_read ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!item.is_read && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />}
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.company || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{item.subject || item.message.slice(0, 50) + '...'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadge(item.status)}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(item)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>询盘详情</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedInquiry.email}</span>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedInquiry.phone}</span>
                  </div>
                )}
                {selectedInquiry.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedInquiry.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{new Date(selectedInquiry.created_at).toLocaleString('zh-CN')}</span>
                </div>
              </div>

              {selectedInquiry.subject && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">主题</h4>
                  <p className="text-sm text-gray-600">{selectedInquiry.subject}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">留言内容</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <span className="text-sm text-gray-700">更新状态：</span>
                {['pending', 'processing', 'replied', 'closed'].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selectedInquiry.status === status ? 'default' : 'outline'}
                    className={selectedInquiry.status === status ? 'bg-orange-500 hover:bg-orange-600' : ''}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, status)}
                  >
                    {statusLabels[status]}
                  </Button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600"
                >
                  邮件回复
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
