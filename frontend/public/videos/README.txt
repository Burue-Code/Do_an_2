Thư mục chứa video (trailer, clip mẫu).

Để có 1 video mẫu:
- Tải file MP4/WebM ngắn từ nguồn miễn phí (sample-videos.com, coverr.co, pexels.com/videos).
- Đặt vào thư mục này (ví dụ sample.mp4). Trong code: src="/videos/sample.mp4"

Để có 100 file video (video-01.mp4 .. video-100.mp4):
- Đặt 1 file mẫu .mp4 hoặc .webm vào thư mục này.
- Chạy: powershell -ExecutionPolicy Bypass -File create-100-videos.ps1
- Script sẽ copy thành video-01, video-02, ... video-100 (cùng nội dung).
