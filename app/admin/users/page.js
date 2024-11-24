export const runtime = 'edge';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">User Management</h2>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-10"
            />
          </div>
          <select className="px-4 py-2 border rounded-md">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Customer</option>
            <option>Support</option>
          </select>
          <select className="px-4 py-2 border rounded-md">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample row - replace with actual data */}
              <tr className="border-b">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      JD
                    </div>
                    <div className="font-medium">John Doe</div>
                  </div>
                </td>
                <td className="px-4 py-3">john@example.com</td>
                <td className="px-4 py-3">Customer</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Active
                  </span>
                </td>
                <td className="px-4 py-3">2024-01-01</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View Orders</Button>
                    <Button variant="destructive" size="sm">Suspend</Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing 1 to 10 of 100 users
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </Card>

      {/* Reviews Section */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
        <div className="space-y-4">
          {/* Sample review - replace with actual data */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">Great Product!</div>
                <div className="text-sm text-gray-500">by John Doe</div>
              </div>
              <div className="flex items-center">
                {/* Star rating */}
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              This product exceeded my expectations. Great quality and fast shipping!
            </p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm">Reply</Button>
              <Button variant="destructive" size="sm">Remove</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
