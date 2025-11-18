import { useEffect, useState } from "react";
import {
  MessageCircle,
  User,
  ShoppingBag,
  Clock,
  RefreshCw,
  Search,
  CheckCircle2,
  MoreHorizontal,
  TrendingUp,
  Star,
  Eye,
} from "lucide-react";

function App() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product_review?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgReviewLength = reviews.length
    ? Math.round(
        reviews.reduce((acc, r) => acc + r.product_review.length, 0) /
          reviews.length
      )
    : 0;

  return (
    <div className="min-h-screen w-screen bg-sky-500 text-slate-200">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 text-white p-3 rounded-xl shadow-sm">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    WhatsApp Review Collector
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-900">
              <div>
                <p className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
                  Total Reviews
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {reviews.length}
                </p>
                <p className="text-xs text-white">All time feedback</p>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-900">
              <div>
                <p className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
                  Latest Product
                </p>
                <p className="text-3xl font-bold text-white mb-1 truncate">
                  {reviews.length > 0 ? reviews[0].product_name : "N/A"}
                </p>
                <p className="text-xs text-white">Most recent review</p>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-900">
              <div>
                <p className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
                  Avg Length
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {avgReviewLength}
                </p>
                <p className="text-xs text-white">Characters per review</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-800 bg-slate-900">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="font-bold text-white text-xl">
                    Recent Feedback
                  </h2>
                  <p className="text-slate-400 text-sm mt-0.5">
                    Latest customer reviews and ratings
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Review
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-4 bg-slate-800 rounded-full">
                            <MessageCircle
                              size={32}
                              className="text-slate-500"
                            />
                          </div>
                          <p className="font-semibold text-slate-300 text-lg">
                            {searchTerm
                              ? "No matching reviews"
                              : "No reviews yet"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {searchTerm
                              ? "Try adjusting your search criteria"
                              : "Waiting for customer feedback"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((review) => (
                      <tr
                        key={review.id}
                        className="group hover:bg-slate-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shrink-0">
                              {review.user_name
                                ? review.user_name[0].toUpperCase()
                                : "?"}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-white text-sm">
                                {review.user_name}
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <User size={10} />
                                <span className="truncate">
                                  {review.contact_number.replace(
                                    "whatsapp:",
                                    ""
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                            <ShoppingBag size={12} />
                            {review.product_name}
                          </span>
                        </td>

                        <td className="px-6 py-4 max-w-md">
                          <p className="text-sm text-slate-300 line-clamp-2">
                            "{review.product_review}"
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} />
                            Received
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {formatDate(review.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {filteredReviews.length === 0 ? (
                <div className="px-4 py-20 text-center">
                  <p className="text-slate-400">No reviews found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shrink-0">
                          {review.user_name
                            ? review.user_name[0].toUpperCase()
                            : "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white">
                            {review.user_name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {review.contact_number.replace("whatsapp:", "")}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                          {review.product_name}
                        </span>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-3 mb-3 border border-slate-800">
                        <p className="text-sm text-slate-300">
                          "{review.product_review}"
                        </p>
                      </div>

                      <div className="text-xs text-slate-500">
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-900 p-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm text-slate-400">
                Showing{" "}
                <span className="font-bold text-white">
                  {filteredReviews.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-white">{reviews.length}</span>{" "}
                reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
