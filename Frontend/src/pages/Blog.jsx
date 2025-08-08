import { Button } from "@/components/ui/button";

export default function Blog() {
  const blogs = [
    {
      id: 1,
      title: "How to Grow on YouTube",
      img: "https://images.unsplash.com/photo-1740021546242-8b718a3e0459",
      date: "February 23, 2025",
      description: "Learn the best strategies to grow your YouTube channel.",
    },
    {
      id: 2,
      title: "Best Video Editing Software",
      img: "https://images.unsplash.com/photo-1740021546242-8b718a3e0459",
      date: "February 10, 2025",
      description: "Top video editing tools for beginners and professionals.",
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Blog</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300"
            >
              <a href={post.link}>
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded"
                />
              </a>
              <span className="block mt-3 text-sm text-gray-500">{post.date}</span>
              <a href={post.link}>
                <h3 className="text-xl font-semibold mt-2 hover:text-red-500 transition">
                  {post.title}
                </h3>
              </a>
              <p className="text-gray-700 mt-2">{post.description}</p>
              <div className="mt-4">
                <a href={`blog/${post.id}`}>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    Read More <i className="fa-solid fa-angle-right ml-2"></i>
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
