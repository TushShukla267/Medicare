# pose_estimation.py
import cv2
import mediapipe as mp
import numpy as np

class PoseEstimator:
    """
    A class to handle pose estimation using MediaPipe.
    """
    def __init__(self, model_complexity=2, min_detection_confidence=0.5, min_tracking_confidence=0.5):
        """
        Initializes the MediaPipe Pose model.
        
        Args:
            model_complexity (int): Complexity of the pose landmark model: 0, 1, or 2.
            min_detection_confidence (float): Minimum confidence value for person detection.
            min_tracking_confidence (float): Minimum confidence value for pose landmark tracking.
        """
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            model_complexity=model_complexity,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        self.mp_drawing = mp.solutions.drawing_utils

    def detect_pose(self, frame):
        """
        Detects pose landmarks in a given frame.

        Args:
            frame: The input image frame from OpenCV.

        Returns:
            A tuple containing the MediaPipe pose results and the annotated frame.
        """
        # Convert the BGR image to RGB
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False

        # Process the image and find poses
        results = self.pose.process(image_rgb)
        
        image_rgb.flags.writeable = True
        annotated_frame = frame.copy()

        # Draw the pose annotation on the image.
        if results.pose_landmarks:
            self.mp_drawing.draw_landmarks(
                annotated_frame,
                results.pose_landmarks,
                self.mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=self.mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
                connection_drawing_spec=self.mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
            )
        
        return results, annotated_frame

    @staticmethod
    def get_keypoints_from_results(results) -> list:
        """Extracts keypoints into a simple list of dictionaries."""
        if not results or not results.pose_landmarks:
            return []
        
        keypoints = []
        for i, landmark in enumerate(results.pose_landmarks.landmark):
            keypoints.append({
                "index": i,
                "name": mp.solutions.pose.PoseLandmark(i).name,
                "x": landmark.x,
                "y": landmark.y,
                "z": landmark.z,
                "visibility": landmark.visibility
            })
        return keypoints

    @staticmethod
    def get_bounding_box(landmarks, frame_shape) -> list:
        """Calculates the bounding box [x_min, y_min, width, height] in relative coordinates."""
        if not landmarks:
            return [0, 0, 0, 0]
        
        h, w, _ = frame_shape
        x_coords = [lm.x for lm in landmarks.landmark]
        y_coords = [lm.y for lm in landmarks.landmark]
        
        x_min, x_max = min(x_coords), max(x_coords)
        y_min, y_max = min(y_coords), max(y_coords)
        
        return [x_min, y_min, x_max - x_min, y_max - y_min]