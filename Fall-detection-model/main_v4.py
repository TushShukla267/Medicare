# main_v4.py
import cv2
import json
import time
from threading import Thread
from queue import Queue

# Import V4 modules
import config_v4 as config
from camera_feed import CameraFeed
from pose_estimation import PoseEstimator
from fall_detection_v4 import FallDetectorV4, FallState
from alert_system import AlertSystem

def draw_debug_info(frame, debug_info, status):
    """Draws all the debug information on the frame."""
    y_pos = 90
    # --- State: NORMAL ---
    if status == FallState.NORMAL.name:
        ht = debug_info.get('person_ht', 0)
        drop = debug_info.get('drop_dist', 0)
        text_ht = f"Person Ht: {ht:.2f}"
        text_drop = f"Drop Dist: {drop:.2f}"
        
        # Check if drop is significant
        is_dropping = ht > 0 and drop > config.HEIGHT_DROP_THRESHOLD * ht
        color_drop = (0, 0, 255) if is_dropping else (0, 255, 0)

        cv2.putText(frame, text_ht, (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        cv2.putText(frame, text_drop, (10, y_pos + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color_drop, 2)

    # --- State: POTENTIAL_FALL ---
    if status == FallState.POTENTIAL_FALL.name:
        angle = debug_info.get('torso_angle', 0)
        ratio = debug_info.get('aspect_ratio', 0)
        inactive = debug_info.get('is_inactive', False)
        on_ground = debug_info.get('is_on_ground', False)

        color_angle = (0, 255, 0) if angle > config.TORSO_ANGLE_THRESHOLD else (0, 0, 255)
        color_ratio = (0, 255, 0) if ratio < config.ASPECT_RATIO_THRESHOLD else (0, 0, 255)
        color_inactive = (0, 255, 0) if inactive else (0, 0, 255)
        
        cv2.putText(frame, f"Torso Ang: {angle:.1f}", (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color_angle, 2)
        cv2.putText(frame, f"Aspect R: {ratio:.2f}", (10, y_pos+25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color_ratio, 2)
        cv2.putText(frame, f"Inactive: {inactive}", (10, y_pos+50), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color_inactive, 2)
        cv2.putText(frame, f"ON GROUND: {on_ground}", (10, y_pos+75), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)


# The FrameProcessor class is identical to V3, but must instantiate FallDetectorV4
class FrameProcessor:
    def __init__(self):
        self.frame_queue = Queue(maxsize=1)
        self.result_queue = Queue(maxsize=1)
        self.is_running = False
        self.pose_estimator = PoseEstimator(model_complexity=config.POSE_MODEL_COMPLEXITY)
        self.fall_detector = FallDetectorV4() # <-- Using V4 detector
        self.alert_system = AlertSystem()
        self.processing_thread = Thread(target=self._processing_loop, daemon=True)

    def _processing_loop(self):
        while self.is_running:
            try: frame = self.frame_queue.get(timeout=1)
            except Exception: continue
            
            pose_results, annotated_frame = self.pose_estimator.detect_pose(frame)
            json_output = {}
            debug_info = {}
            status = self.fall_detector.state.name

            if pose_results and pose_results.pose_landmarks:
                detection_result = self.fall_detector.process_pose(pose_results.pose_landmarks)
                debug_info = detection_result.get("debug_info", {})
                status = detection_result.get("status", self.fall_detector.state.name)
                
                if detection_result["fall_detected"]:
                    confidence = 1.0
                    keypoints = self.pose_estimator.get_keypoints_from_results(pose_results)
                    bbox = self.pose_estimator.get_bounding_box(pose_results.pose_landmarks, frame.shape)
                    json_output = self.alert_system.process_detection(
                        {"confidence": confidence, "fall_detected": True}, keypoints, bbox
                    )
            
            draw_debug_info(annotated_frame, debug_info, status)
            if not self.result_queue.full():
                self.result_queue.put((annotated_frame, json_output, status))

    def start(self):
        self.is_running = True
        self.processing_thread.start()

    def stop(self):
        self.is_running = False
        self.processing_thread.join()

def main():
    # This is mostly the same as V3, but handles the new debug info
    camera = CameraFeed(source=config.CAMERA_SOURCE)
    if not camera.start(): return

    processor = FrameProcessor()
    processor.start()
    last_frame_time = time.time()
    annotated_frame, current_status = None, FallState.NORMAL.name

    while True:
        success, frame = camera.get_frame()
        if not success: break
        frame = cv2.resize(frame, (config.FRAME_WIDTH, config.FRAME_HEIGHT))
        if not processor.frame_queue.full(): processor.frame_queue.put(frame)

        if not processor.result_queue.empty():
            annotated_frame, json_output, current_status = processor.result_queue.get()
        
        display_frame = annotated_frame if annotated_frame is not None else frame
        
        # FPS calculation with safety check
        delta_time = time.time() - last_frame_time
        fps = 1 / delta_time if delta_time > 0 else 999
        last_frame_time = time.time()
        
        # Display Status and FPS
        color = (0, 255, 0)
        if current_status == FallState.POTENTIAL_FALL.name: color = (0, 255, 255)
        elif current_status == FallState.FALL_CONFIRMED.name: color = (0, 0, 255)
        cv2.putText(display_frame, f"FPS: {fps:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.putText(display_frame, f"STATUS: {current_status}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

        cv2.imshow('Fall Detection V4', display_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break

    processor.stop()
    camera.stop()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()