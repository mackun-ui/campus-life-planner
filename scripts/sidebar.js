// Sidebar Toggle Logic
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector("header");
  const toggleBtn = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggleBtn) return;

  // Toggle sidebar visibility
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });

  // Close sidebar when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("show") &&
      !sidebar.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      sidebar.classList.remove("show");
    }
  });

  // Optional: close sidebar when resizing back to desktop view
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      sidebar.classList.remove("show");
    }
  });
});
