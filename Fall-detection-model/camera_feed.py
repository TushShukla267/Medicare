# camera_feed.py
import cv2

class CameraFeed:
    """
    Handles capturing video frames from a specified camera source.
    
    Args:
        source (int or str): The camera source index (e.g., 0 for webcam) or
                             a video stream URL (e.g., for an IP camera).
    """
    def __init__(self, source=0):
        self.source = source
        self.cap = None

    def start(self) -> bool:
        """Initializes and opens the video capture source."""
        print(f"[INFO] Starting camera feed from source: {self.source}")
        self.cap = cv2.VideoCapture(self.source)
        if not self.cap.isOpened():
            print(f"[ERROR] Cannot open camera source: {self.source}")
            return False
        return True

    def get_frame(self):
        """
        Reads a single frame from the camera feed.
        
        Returns:
            A tuple (bool, frame), where the boolean indicates success
            and frame is the captured image.
        """
        if self.cap is None or not self.cap.isOpened():
            return False, None
        
        ret, frame = self.cap.read()
        if not ret:
            print("[WARNING] Failed to grab frame.")
            return False, None
        
        return True, frame

    def stop(self):
        """Releases the video capture source."""
        if self.cap is not None:
            print("[INFO] Stopping camera feed.")
            self.cap.release()