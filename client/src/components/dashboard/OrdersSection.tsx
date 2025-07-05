
import { ShoppingBag } from "lucide-react";

interface OrdersSectionProps {
  orders: any[];
}

const OrdersSection = ({ orders }: OrdersSectionProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <ShoppingBag className="h-6 w-6 text-white" />
        <h3 className="text-lg font-semibold text-white">Order History</h3>
      </div>
      
      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet. Start shopping!</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-300">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">₦{order.total_amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    order.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : order.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : order.status === 'cancelled' || order.status === 'payment_failed'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {order.tracking_number && order.shipping_carrier && (
                <div className="border-t border-white/10 pt-3 text-sm">
                  <p className="text-gray-200">
                    Tracking: <span className="font-medium text-white">{order.tracking_number}</span> via {order.shipping_carrier}
                  </p>
                  {order.estimated_delivery_date && (
                    <p className="text-gray-400">
                      Estimated Delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
